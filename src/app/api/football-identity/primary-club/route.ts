import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

type PrimaryClubRequest = {
  primaryClubId?: string | null;
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
      (await request.json()) as PrimaryClubRequest;

    const noAffiliation =
      body.noAffiliation === true;

    const primaryClubId =
      typeof body.primaryClubId === "string"
        ? body.primaryClubId.trim()
        : "";

    if (!noAffiliation && !primaryClubId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please choose your Primary Club or select that you do not follow one.",
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
        data: club,
        error: clubError,
      } = await supabaseAdmin
        .from("football_clubs")
        .select("id, is_active")
        .eq("id", primaryClubId)
        .maybeSingle();

      if (
        clubError ||
        !club ||
        club.is_active !== true
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "That football club is not currently available.",
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
     * Never move someone backwards.
     */
    if (
      identity.current_step !== "PRIMARY_CLUB"
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
        primary_club_status:
          noAffiliation
            ? "NO_AFFILIATION"
            : "SELECTED",

        primary_club_id:
          noAffiliation
            ? null
            : primaryClubId,

        identity_status: "IN_PROGRESS",

        current_step: "FOOTBALL_ROLE",

        updated_at: now,
      })
      .eq("id", identity.id)
      .eq("member_id", member.id)
      .select(`
        identity_status,
        current_step,
        primary_club_status,
        primary_club_id
      `)
      .single();

    if (updateError) {
      console.error(
        "Primary Club save error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not save your Primary Club.",
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
        primaryClubStatus:
          updatedIdentity.primary_club_status,
        primaryClubId:
          updatedIdentity.primary_club_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Primary Club route error:",
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