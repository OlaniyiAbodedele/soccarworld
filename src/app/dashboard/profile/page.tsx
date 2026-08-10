import { redirect } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import ProfileClient from "./ProfileClient";

export default async function FounderProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/sign-in");
  }

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
        account_status
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

  return (
    <ProfileClient
      memberId={member.id}
      firstName={member.first_name}
      lastName={member.last_name}
      email={member.email}
      memberType={member.member_type}
      countryOfResidence={
        member.country_of_residence
      }
      countryOfOrigin={member.country_of_origin}
      cityOfResidence={member.city_of_residence}
      username={member.username}
    />
  );
}