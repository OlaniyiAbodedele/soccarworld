import { redirect } from "next/navigation";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import FootballIdentityShell from "./FootballIdentityShell";

function formatFounderNumber(
  founderNumber: number | null
) {
  if (founderNumber === null) {
    return null;
  }

  return String(founderNumber).padStart(6, "0");
}

export default async function FootballIdentityPage() {
  /*
   * 1. Confirm authenticated Supabase session.
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
   * 2. Create secure server-only admin client.
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
   * 3. Retrieve authenticated SoccaR member.
   */
  const {
    data: member,
    error: memberError,
  } = await supabaseAdmin
    .from("soccar_members")
    .select(`
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
    `)
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
   * 4. Retrieve permanent Founder Number.
   */
  let founderNumber: string | null = null;

  if (member.founder_membership_id) {
    const {
      data: founderMembership,
      error: founderMembershipError,
    } = await supabaseAdmin
      .from("founder_memberships")
      .select(`
        founder_number,
        status
      `)
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
        Number(
          founderMembership.founder_number
        )
      );
    }
  }

  /*
   * 5. Retrieve or create Football Identity.
   */
  const {
    data: existingIdentity,
    error: identityError,
  } = await supabaseAdmin
    .from("football_identities")
    .select(`
      id,
      identity_status,
      current_step,
      national_team_status,
      national_team_id,
      primary_club_status,
      primary_club_id,
      football_bio,
      profile_photo_path,
      started_at,
      completed_at
    `)
    .eq("member_id", member.id)
    .maybeSingle();

  if (identityError) {
    throw new Error(
      "Could not load Football Identity."
    );
  }

  let footballIdentity =
    existingIdentity;

  if (!footballIdentity) {
    const {
      data: createdIdentity,
      error: createIdentityError,
    } = await supabaseAdmin
      .from("football_identities")
      .insert({
        member_id: member.id,
        identity_status: "NOT_STARTED",
        current_step: "WELCOME",
      })
      .select(`
        id,
        identity_status,
        current_step,
        national_team_status,
        national_team_id,
        primary_club_status,
        primary_club_id,
        football_bio,
        profile_photo_path,
        started_at,
        completed_at
      `)
      .single();

    if (createIdentityError) {
      throw new Error(
        "Could not create Football Identity."
      );
    }

    footballIdentity =
      createdIdentity;
  }

  /*
   * 6. Load canonical National Teams.
   */
  const {
    data: nationalTeams,
    error: nationalTeamsError,
  } = await supabaseAdmin
    .from("national_teams")
    .select(`
      id,
      name,
      country_code,
      country_name,
      nickname,
      confederation
    `)
    .eq("is_active", true)
    .order("name", {
      ascending: true,
    });

  if (nationalTeamsError) {
    throw new Error(
      "Could not load National Teams."
    );
  }

  /*
   * 7. Load canonical Football Clubs.
   */
  const {
    data: footballClubs,
    error: footballClubsError,
  } = await supabaseAdmin
    .from("football_clubs")
    .select(`
      id,
      name,
      short_name,
      country_code,
      country_name,
      city,
      gender_category,
      club_type
    `)
    .eq("is_active", true)
    .order("name", {
      ascending: true,
    });

  if (footballClubsError) {
    throw new Error(
      "Could not load Football Clubs."
    );
  }

  /*
   * 8. Load the 18 canonical Football Role Families.
   */
  const {
    data: footballRoleFamilies,
    error: footballRoleFamiliesError,
  } = await supabaseAdmin
    .from("football_role_families")
    .select(`
      id,
      name,
      slug,
      sort_order
    `)
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  if (footballRoleFamiliesError) {
    throw new Error(
      "Could not load Football Role Families."
    );
  }

  /*
   * 9. Load the canonical Football Roles.
   */
  const {
    data: footballRoles,
    error: footballRolesError,
  } = await supabaseAdmin
    .from("football_roles")
    .select(`
      id,
      family_id,
      name,
      slug,
      sort_order
    `)
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  if (footballRolesError) {
    throw new Error(
      "Could not load Football Roles."
    );
  }

  /*
   * 10. Load any roles already attached to
   * this member. This supports future resume/edit.
   */
  const {
    data: memberFootballRoles,
    error: memberFootballRolesError,
  } = await supabaseAdmin
    .from("member_football_roles")
    .select(`
      role_id,
      role_type
    `)
    .eq("member_id", member.id);

  if (memberFootballRolesError) {
    throw new Error(
      "Could not load member Football Roles."
    );
  }

  /*
   * 11. Pass all trusted server data into
   * the Football Identity client shell.
   */
  return (
    <FootballIdentityShell
      member={{
        id: member.id,

        firstName:
          member.first_name ?? "",

        lastName:
          member.last_name ?? "",

        email:
          member.email ?? "",

        countryOfResidence:
          member.country_of_residence,

        countryOfOrigin:
          member.country_of_origin,

        cityOfResidence:
          member.city_of_residence,

        memberType:
          member.member_type,

        username:
          member.username,

        founderNumber,
      }}

      footballIdentity={{
        id:
          footballIdentity.id,

        identityStatus:
          footballIdentity.identity_status,

        currentStep:
          footballIdentity.current_step,

        nationalTeamStatus:
          footballIdentity.national_team_status,

        nationalTeamId:
          footballIdentity.national_team_id,

        primaryClubStatus:
          footballIdentity.primary_club_status,

        primaryClubId:
          footballIdentity.primary_club_id,

        footballBio:
          footballIdentity.football_bio,

        profilePhotoPath:
          footballIdentity.profile_photo_path,

        startedAt:
          footballIdentity.started_at,

        completedAt:
          footballIdentity.completed_at,
      }}

      nationalTeams={
        nationalTeams ?? []
      }

      footballClubs={
        footballClubs ?? []
      }

      footballRoleFamilies={
        footballRoleFamilies ?? []
      }

      footballRoles={
        footballRoles ?? []
      }

      memberFootballRoles={
        memberFootballRoles ?? []
      }
    />
  );
}