import { redirect } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import CommunityClient from "./CommunityClient";

function formatFounderNumber(
  founderNumber: number | null
) {
  if (founderNumber === null) {
    return null;
  }

  return String(founderNumber).padStart(6, "0");
}

export default async function FounderCommunityPage() {
  /*
   * 1. Confirm the visitor has a valid
   * authenticated Supabase session.
   */
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/sign-in");
  }

  /*
   * 2. Create the secure server-only
   * Supabase admin client.
   */
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing required Supabase server environment variables."
    );
  }

  const supabaseAdmin = createAdminClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  /*
   * 3. Retrieve the current authenticated
   * member for the Founder dashboard shell.
   */
  const {
    data: currentMember,
    error: currentMemberError,
  } = await supabaseAdmin
    .from("soccar_members")
    .select(
      `
        first_name,
        last_name,
        account_status,
        founder_membership_id
      `
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (
    currentMemberError ||
    !currentMember ||
    currentMember.account_status !== "ACTIVE"
  ) {
    redirect("/sign-in");
  }

  /*
   * 4. Retrieve the current member's
   * permanent Founder Number.
   */
  let currentFounderNumber: string | null = null;

  if (currentMember.founder_membership_id) {
    const {
      data: currentFounderMembership,
      error: currentFounderMembershipError,
    } = await supabaseAdmin
      .from("founder_memberships")
      .select(
        `
          founder_number,
          status
        `
      )
      .eq(
        "id",
        currentMember.founder_membership_id
      )
      .maybeSingle();

    if (
      !currentFounderMembershipError &&
      currentFounderMembership &&
      currentFounderMembership.status === "ACTIVE"
    ) {
      currentFounderNumber =
        formatFounderNumber(
          Number(
            currentFounderMembership.founder_number
          )
        );
    }
  }

  /*
   * 5. Retrieve only the community-safe
   * identity fields for active Founding Members.
   */
  const {
    data: communityMembers,
    error: communityError,
  } = await supabaseAdmin
    .from("soccar_members")
    .select(
      `
        first_name,
        last_name,
        username,
        member_type,
        country_of_residence,
        founder_membership_id
      `
    )
    .eq("account_status", "ACTIVE")
    .not("founder_membership_id", "is", null)
    .order("created_at", {
      ascending: true,
    });

  if (communityError) {
    console.error(
      "Founder Community member lookup error:",
      communityError
    );

    throw new Error(
      "Could not load the Founding Community."
    );
  }

  const safeCommunityMembers =
    communityMembers ?? [];

  /*
   * 6. Collect the Founder membership IDs
   * so their permanent Founder Numbers can
   * be retrieved separately.
   */
  const founderMembershipIds =
    safeCommunityMembers
      .map(
        (member) =>
          member.founder_membership_id
      )
      .filter(
        (id): id is string =>
          typeof id === "string"
      );

  let founderMemberships: {
    id: string;
    founder_number: number;
    status: string;
  }[] = [];

  if (founderMembershipIds.length > 0) {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("founder_memberships")
      .select(
        `
          id,
          founder_number,
          status
        `
      )
      .in("id", founderMembershipIds)
      .eq("status", "ACTIVE");

    if (error) {
      console.error(
        "Founder Community membership lookup error:",
        error
      );

      throw new Error(
        "Could not load Founder Numbers."
      );
    }

    founderMemberships =
      (data ?? []) as {
        id: string;
        founder_number: number;
        status: string;
      }[];
  }

  /*
   * 7. Create a lookup between the internal
   * Founder membership ID and public Founder Number.
   */
  const founderNumberByMembershipId =
    new Map<string, string | null>(
      founderMemberships.map(
        (membership) => [
          membership.id,
          formatFounderNumber(
            Number(
              membership.founder_number
            )
          ),
        ]
      )
    );

  /*
   * 8. Build the privacy-safe Founder
   * Community directory.
   */
  const founders = safeCommunityMembers
    .map((member) => {
      const founderMembershipId =
        member.founder_membership_id;

      if (!founderMembershipId) {
        return null;
      }

      const founderNumber =
        founderNumberByMembershipId.get(
          founderMembershipId
        );

      if (!founderNumber) {
        return null;
      }

      return {
        founderNumber,
        firstName:
          member.first_name ?? "",
        lastName:
          member.last_name ?? "",
        username:
          member.username ?? null,
        memberType:
          member.member_type ?? null,
        countryOfResidence:
          member.country_of_residence ??
          null,
      };
    })
    .filter(
      (
        founder
      ): founder is {
        founderNumber: string;
        firstName: string;
        lastName: string;
        username: string | null;
        memberType: string | null;
        countryOfResidence: string | null;
      } => founder !== null
    )
    .sort((a, b) =>
      a.founderNumber.localeCompare(
        b.founderNumber
      )
    );

  /*
   * 9. Calculate real community statistics.
   */
  const countriesRepresented =
    new Set(
      founders
        .map(
          (founder) =>
            founder.countryOfResidence
        )
        .filter(
          (country): country is string =>
            Boolean(country)
        )
    ).size;

  const memberTypesRepresented =
    new Set(
      founders
        .map(
          (founder) =>
            founder.memberType
        )
        .filter(
          (memberType): memberType is string =>
            Boolean(memberType)
        )
    ).size;

  /*
   * 10. Render State 03 inside the authenticated
   * Founder Experience shell.
   */
  return (
    <CommunityClient
      currentFirstName={
        currentMember.first_name ?? ""
      }
      currentLastName={
        currentMember.last_name ?? ""
      }
      currentFounderNumber={
        currentFounderNumber
      }
      founders={founders}
      founderCount={founders.length}
      countriesRepresented={
        countriesRepresented
      }
      memberTypesRepresented={
        memberTypesRepresented
      }
    />
  );
}