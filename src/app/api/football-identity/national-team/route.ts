import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

type NationalTeamRequest = {
  nationalTeamId?: string | null;
  noAffiliation?: boolean;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in.",
        },
        { status: 401 }
      );
    }

    const body =
      (await request.json()) as NationalTeamRequest;

    const noAffiliation =
      body.noAffiliation === true;

    const nationalTeamId =
      typeof body.nationalTeamId === "string"
        ? body.nationalTeamId.trim()
        : "";

    if (!noAffiliation && !nationalTeamId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please choose a national team or select that you do not follow one.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error.",
        },
        { status: 500 }
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
      .select("id, account_status")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (
      memberError ||
      !member ||
      member.account_status !== "ACTIVE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your SoccaR membership is not currently active.",
        },
        { status: 403 }
      );
    }

    if (!noAffiliation) {
      const {
        data: team,
        error: teamError,
      } = await supabaseAdmin
        .from("national_teams")
        .select("id, is_active")
        .eq("id", nationalTeamId)
        .maybeSingle();

      if (
        teamError ||
        !team ||
        team.is_active !== true
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "That national team is not available.",
          },
          { status: 400 }
        );
      }
    }

    const {
      data: identity,
      error: identityError,
    } = await supabaseAdmin
      .from("football_identities")
      .select(`
        id,
        identity_status,
        current_step
      `)
      .eq("member_id", member.id)
      .maybeSingle();

    if (identityError || !identity) {
      return NextResponse.json(
        {
          success: false,
          message:
            "We could not load your Football Identity.",
        },
        { status: 500 }
      );
    }

    /*
     * Do not move an already-advanced member backwards.
     */
    if (
      identity.current_step !== "NATIONAL_TEAM"
    ) {
      return NextResponse.json(
        {
          success: true,
          identityStatus:
            identity.identity_status,
          currentStep:
            identity.current_step,
        },
        { status: 200 }
      );
    }

    const now = new Date().toISOString();

    const {
      data: updatedIdentity,
      error: updateError,
    } = await supabaseAdmin
      .from("football_identities")
      .update({
        national_team_status:
          noAffiliation
            ? "NO_AFFILIATION"
            : "SELECTED",

        national_team_id:
          noAffiliation
            ? null
            : nationalTeamId,

        identity_status: "IN_PROGRESS",
        current_step: "PRIMARY_CLUB",
        updated_at: now,
      })
      .eq("id", identity.id)
      .eq("member_id", member.id)
      .select(`
        identity_status,
        current_step,
        national_team_status,
        national_team_id
      `)
      .single();

    if (updateError) {
      console.error(
        "National Team save error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not save your National Team selection.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        identityStatus:
          updatedIdentity.identity_status,
        currentStep:
          updatedIdentity.current_step,
        nationalTeamStatus:
          updatedIdentity.national_team_status,
        nationalTeamId:
          updatedIdentity.national_team_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "National Team route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened.",
      },
      { status: 500 }
    );
  }
}