import "server-only";

import { redirect } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

function formatFounderNumber(
  founderNumber: number | null
) {
  if (founderNumber === null) {
    return null;
  }

  return String(founderNumber).padStart(
    6,
    "0"
  );
}

export type FounderDashboardData = {
  memberId: string;
  firstName: string;
  lastName: string;
  founderNumber: string | null;
  email: string | null;
  memberType: string | null;
  countryOfResidence: string | null;
  countryOfOrigin: string | null;
  cityOfResidence: string | null;
  username: string | null;
};

export async function getFounderDashboardData(): Promise<FounderDashboardData> {
  /*
   * 1. Confirm authenticated session.
   */
  const supabase =
    await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/sign-in");
  }

  /*
   * 2. Secure server-only admin client.
   */
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SECRET_KEY;

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    throw new Error(
      "Missing required Supabase server environment variables."
    );
  }

  const supabaseAdmin =
    createAdminClient(
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
   * 3. Retrieve authenticated member.
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
    member.account_status !==
      "ACTIVE"
  ) {
    redirect("/sign-in");
  }

  /*
   * 4. Retrieve Founder Number.
   */
  let founderNumber:
    | string
    | null = null;

  if (
    member.founder_membership_id
  ) {
    const {
      data: founderMembership,
      error: founderError,
    } = await supabaseAdmin
      .from("founder_memberships")
      .select(
        "founder_number, status"
      )
      .eq(
        "id",
        member.founder_membership_id
      )
      .maybeSingle();

    if (
      !founderError &&
      founderMembership &&
      founderMembership.status ===
        "ACTIVE"
    ) {
      founderNumber =
        formatFounderNumber(
          Number(
            founderMembership.founder_number
          )
        );
    }
  }

  return {
    memberId: member.id,
    firstName: member.first_name,
    lastName: member.last_name,
    founderNumber,
    email: member.email,
    memberType:
      member.member_type,
    countryOfResidence:
      member.country_of_residence,
    countryOfOrigin:
      member.country_of_origin,
    cityOfResidence:
      member.city_of_residence,
    username: member.username,
  };
}