import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export async function POST() {
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

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "Missing required Supabase server environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error.",
        },
        { status: 500 }
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

    const {
      data: member,
      error: memberError,
    } = await supabaseAdmin
      .from("soccar_members")
      .select("id, account_status")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (memberError) {
      console.error(
        "Football Identity completion member lookup error:",
        memberError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not verify your SoccaR membership.",
        },
        { status: 500 }
      );
    }

    if (
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

    const {
      data: identity,
      error: identityError,
    } = await supabaseAdmin
      .from("football_identities")
      .select(`
        id,
        identity_status,
        current_step,
        national_team_status,
        primary_club_status,
        football_bio,
        completed_at
      `)
      .eq("member_id", member.id)
      .maybeSingle();

    if (identityError) {
      console.error(
        "Football Identity completion lookup error:",
        identityError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not load your Football Identity.",
        },
        { status: 500 }
      );
    }

    if (!identity) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your Football Identity could not be found.",
        },
        { status: 404 }
      );
    }

    if (
      identity.identity_status === "COMPLETE"
    ) {
      return NextResponse.json(
        {
          success: true,
          identityStatus:
            identity.identity_status,
          currentStep:
            identity.current_step,
          completedAt:
            identity.completed_at,
        },
        { status: 200 }
      );
    }

    if (
      identity.current_step !== "REVEAL"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your Football Identity journey is not ready to be completed yet.",
        },
        { status: 409 }
      );
    }

    if (
      identity.national_team_status ===
        "UNANSWERED" ||
      identity.primary_club_status ===
        "UNANSWERED" ||
      !String(identity.football_bio ?? "").trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your Football Identity is missing required information.",
        },
        { status: 409 }
      );
    }

    const {
      data: primaryRole,
      error: primaryRoleError,
    } = await supabaseAdmin
      .from("member_football_roles")
      .select("id")
      .eq("member_id", member.id)
      .eq("role_type", "PRIMARY")
      .maybeSingle();

    if (primaryRoleError) {
      console.error(
        "Football Identity completion Primary Role lookup error:",
        primaryRoleError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not verify your Primary Football Role.",
        },
        { status: 500 }
      );
    }

    if (!primaryRole) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete your Primary Football Role before finishing your Football Identity.",
        },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const {
      data: completedIdentity,
      error: completionError,
    } = await supabaseAdmin
      .from("football_identities")
      .update({
        identity_status: "COMPLETED",
        current_step: "REVEAL",
        completed_at: now,
        updated_at: now,
      })
      .eq("id", identity.id)
      .eq("member_id", member.id)
      .select(`
        identity_status,
        current_step,
        completed_at
      `)
      .single();

    if (completionError) {
      console.error(
        "Football Identity completion update error:",
        completionError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not complete your Football Identity.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        identityStatus:
          completedIdentity.identity_status,
        currentStep:
          completedIdentity.current_step,
        completedAt:
          completedIdentity.completed_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Football Identity completion route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened while completing your Football Identity.",
      },
      { status: 500 }
    );
  }
}