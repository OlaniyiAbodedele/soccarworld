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
      .select(`
        id,
        account_status,
        country_of_residence,
        country_of_origin,
        city_of_residence
      `)
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

    const countryOfResidence =
      String(
        member.country_of_residence ?? ""
      ).trim();

    const countryOfOrigin =
      String(
        member.country_of_origin ?? ""
      ).trim();

    const cityOfResidence =
      String(
        member.city_of_residence ?? ""
      ).trim();

    if (
      !countryOfResidence ||
      !countryOfOrigin ||
      !cityOfResidence
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete your country of origin, country of residence and city of residence before continuing.",
          profileRequired: true,
        },
        { status: 400 }
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
     * Never move a member backwards.
     */
    if (
      identity.current_step !== "FOOTBALL_WORLD"
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
        identity_status: "IN_PROGRESS",
        current_step: "NATIONAL_TEAM",
        updated_at: now,
      })
      .eq("id", identity.id)
      .eq("member_id", member.id)
      .select(`
        identity_status,
        current_step
      `)
      .single();

    if (updateError) {
      console.error(
        "Football World confirmation error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not confirm your Football World.",
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
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Football World route error:",
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