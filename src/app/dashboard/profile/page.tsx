import { redirect } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import DashboardShell from "../DashboardShell";
import ProfileClient from "./ProfileClient";

function formatFounderNumber(
  founderNumber: number | null
) {
  if (founderNumber === null) {
    return null;
  }

  return String(founderNumber).padStart(6, "0");
}

export default async function FounderProfilePage() {
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
   * 3. Retrieve the authenticated
   * Founding Member.
   */
  const {
    data: member,
    error: memberError,
  } = await supabaseAdmin
    .from("soccar_members")
    .select(
      `
        id,
        first_name,
        last_name,
        email,
        country_of_residence,
        country_of_origin,
        city_of_residence,
        member_type,
        username,
        account_status,
        founder_membership_id
      `
    )
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (
    memberError ||
    !member ||
    member.account_status !== "ACTIVE"
  ) {
    redirect("/sign-in");
  }

  /*
   * 4. Retrieve the member's permanent
   * Founder Number for the dashboard shell.
   */
  let founderNumber: string | null = null;

  if (member.founder_membership_id) {
    const {
      data: founderMembership,
      error: founderMembershipError,
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
        member.founder_membership_id
      )
      .maybeSingle();

    if (
      !founderMembershipError &&
      founderMembership &&
      founderMembership.status === "ACTIVE"
    ) {
      founderNumber = formatFounderNumber(
        Number(founderMembership.founder_number)
      );
    }
  }

  /*
   * 5. Render the existing Profile page
   * inside the shared Founder Dashboard shell.
   */
  return (
    <DashboardShell
      firstName={member.first_name ?? ""}
      lastName={member.last_name ?? ""}
      founderNumber={founderNumber}
      email={member.email}
      memberType={member.member_type}
      countryOfResidence={
        member.country_of_residence
      }
      countryOfOrigin={
        member.country_of_origin
      }
      cityOfResidence={
        member.city_of_residence
      }
      username={member.username}
      activeSection="profile"
      unreadUpdates={0}
      contentMode="editorial"
    >
      <ProfileClient
        memberId={member.id}
        firstName={member.first_name ?? ""}
        lastName={member.last_name ?? ""}
        email={member.email ?? ""}
        memberType={member.member_type}
        countryOfResidence={
          member.country_of_residence
        }
        countryOfOrigin={
          member.country_of_origin
        }
        cityOfResidence={
          member.city_of_residence
        }
        username={member.username}
      />
    </DashboardShell>
  );
}