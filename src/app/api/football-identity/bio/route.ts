import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

type FootballBioRequest = {
  footballBio?: string;
};

const FOOTBALL_BIO_MAX_LENGTH = 1500;

export async function POST(request: Request) {
  try {
    /*
     * 1. Confirm authenticated Supabase user.
     */
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

    /*
     * 2. Read and normalize the Football Bio.
     */
    const body =
      (await request.json()) as FootballBioRequest;

    const footballBio = String(
      body.footballBio ?? ""
    ).trim();

    if (!footballBio) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please write a short Football Bio before continuing.",
        },
        { status: 400 }
      );
    }

    if (
      footballBio.length >
      FOOTBALL_BIO_MAX_LENGTH
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your Football Bio cannot exceed 1,500 characters.",
        },
        { status: 400 }
      );
    }

    /*
     * 3. Create secure server-only
     * Supabase admin client.
     */
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

    /*
     * 4. Resolve authenticated SoccaR member.
     */
    const {
      data: member,
      error: memberError,
    } = await supabaseAdmin
      .from("soccar_members")
      .select(
        "id, account_status"
      )
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (memberError) {
      console.error(
        "Football Bio member lookup error:",
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

    /*
     * 5. Confirm the member is genuinely
     * at the Football Bio stage.
     */
    const {
      data: identity,
      error: identityError,
    } = await supabaseAdmin
      .from("football_identities")
      .select(`
        id,
        identity_status,
        current_step,
        football_bio
      `)
      .eq("member_id", member.id)
      .maybeSingle();

    if (identityError) {
      console.error(
        "Football Bio identity lookup error:",
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

    /*
     * Never move an already-advanced
     * Football Identity backwards.
     */
    if (
      identity.current_step !==
      "FOOTBALL_BIO"
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

    /*
     * 6. Save the Bio and advance to
     * the final Reveal stage.
     */
    const now =
      new Date().toISOString();

    const {
      data: updatedIdentity,
      error: updateError,
    } = await supabaseAdmin
      .from("football_identities")
      .update({
        football_bio: footballBio,

        identity_status:
          "IN_PROGRESS",

        current_step:
          "REVEAL",

        updated_at:
          now,
      })
      .eq("id", identity.id)
      .eq("member_id", member.id)
      .select(`
        identity_status,
        current_step,
        football_bio
      `)
      .single();

    if (updateError) {
      console.error(
        "Football Bio save error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not save your Football Bio.",
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

        footballBio:
          updatedIdentity.football_bio,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Football Bio route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened while saving your Football Bio.",
      },
      { status: 500 }
    );
  }
}