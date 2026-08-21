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

export type FootballIdentitySummary = {
  status: string | null;
  isCompleted: boolean;
  footballWorld: string | null;
  nationalTeam: string | null;
  primaryClub: string | null;
  primaryRole: string | null;
  additionalRoles: string[];
  footballBio: string | null;
};

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
  footballIdentity: FootballIdentitySummary | null;
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

  /*
   * 5. Retrieve the member's Football Identity.
   */
  const {
    data: identity,
    error: identityError,
  } = await supabaseAdmin
    .from("football_identities")
    .select(`
      identity_status,
      current_step,
      national_team_status,
      national_team_id,
      primary_club_status,
      primary_club_id,
      football_bio,
      completed_at
    `)
    .eq("member_id", member.id)
    .maybeSingle();

  if (identityError) {
    console.error(
      "Unable to load Founder Football Identity:",
      identityError
    );

    throw new Error(
      "Could not load Football Identity."
    );
  }

  let footballIdentity:
    | FootballIdentitySummary
    | null = null;

  if (identity) {
    let nationalTeam:
      | string
      | null = null;

    let primaryClub:
      | string
      | null = null;

    if (identity.national_team_id) {
      const {
        data: team,
        error: teamError,
      } = await supabaseAdmin
        .from("national_teams")
        .select("name")
        .eq(
          "id",
          identity.national_team_id
        )
        .maybeSingle();

      if (teamError) {
        console.error(
          "Unable to load Founder National Team:",
          teamError
        );
      } else {
        nationalTeam =
          team?.name ?? null;
      }
    }

    if (identity.primary_club_id) {
      const {
        data: club,
        error: clubError,
      } = await supabaseAdmin
        .from("football_clubs")
        .select("name, short_name")
        .eq(
          "id",
          identity.primary_club_id
        )
        .maybeSingle();

      if (clubError) {
        console.error(
          "Unable to load Founder Primary Club:",
          clubError
        );
      } else {
        primaryClub =
          club?.short_name ||
          club?.name ||
          null;
      }
    }

    const {
      data: memberRoles,
      error: memberRolesError,
    } = await supabaseAdmin
      .from("member_football_roles")
      .select(`
        role_type,
        football_roles (
          name
        )
      `)
      .eq("member_id", member.id);

    if (memberRolesError) {
      console.error(
        "Unable to load Founder Football Roles:",
        memberRolesError
      );

      throw new Error(
        "Could not load Football Roles."
      );
    }

    let primaryRole:
      | string
      | null = null;

    const additionalRoles:
      string[] = [];

    for (const row of memberRoles ?? []) {
      const relatedRole = Array.isArray(
        row.football_roles
      )
        ? row.football_roles[0]
        : row.football_roles;

      const roleName =
        relatedRole?.name ?? null;

      if (!roleName) {
        continue;
      }

      if (
        row.role_type === "PRIMARY"
      ) {
        primaryRole = roleName;
      } else if (
        row.role_type === "ADDITIONAL"
      ) {
        additionalRoles.push(
          roleName
        );
      }
    }

    const footballWorld =
      [
        member.city_of_residence,
        member.country_of_residence,
      ]
        .filter(Boolean)
        .join(", ") || null;

    footballIdentity = {
      status:
        identity.identity_status,
      isCompleted:
        identity.identity_status ===
          "COMPLETED" &&
        Boolean(
          identity.completed_at
        ),
      footballWorld,
      nationalTeam:
        identity.national_team_status ===
        "NO_AFFILIATION"
          ? null
          : nationalTeam,
      primaryClub:
        identity.primary_club_status ===
        "NO_AFFILIATION"
          ? null
          : primaryClub,
      primaryRole,
      additionalRoles,
      footballBio:
        identity.football_bio ?? null,
    };
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
    footballIdentity,
  };
}