import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ActivationRequest = {
  token?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as ActivationRequest;

    const token = String(
      body.token ?? ""
    ).trim();

    const password = String(
      body.password ?? ""
    );

    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Activation token and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your password must contain at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SECRET_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      console.error(
        "Missing required Supabase server environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Server configuration error.",
        },
        { status: 500 }
      );
    }

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

    const tokenHash =
      createHash("sha256")
        .update(token)
        .digest("hex");

    /*
     * 1. Find the authorised
     * account activation record.
     */
    const {
      data: activation,
      error: activationError,
    } = await supabaseAdmin
      .from(
        "soccar_account_activations"
      )
      .select(
        `
          id,
          member_id,
          status,
          expires_at,
          soccar_members (
            id,
            first_name,
            last_name,
            email,
            account_status,
            auth_user_id
          )
        `
      )
      .eq(
        "token_hash",
        tokenHash
      )
      .maybeSingle();

    if (activationError) {
      console.error(
        "Account activation lookup error:",
        activationError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not validate this activation link.",
        },
        { status: 500 }
      );
    }

    if (!activation) {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID",
          message:
            "This SoccaR account activation link is invalid.",
        },
        { status: 400 }
      );
    }

    if (
      activation.status !==
      "ACTIVE"
    ) {
      return NextResponse.json(
        {
          success: false,
          code: "INACTIVE",
          message:
            "This SoccaR account activation link is no longer active.",
        },
        { status: 409 }
      );
    }

    if (
      new Date(
        activation.expires_at
      ).getTime() <= Date.now()
    ) {
      await supabaseAdmin
        .from(
          "soccar_account_activations"
        )
        .update({
          status: "EXPIRED",
        })
        .eq(
          "id",
          activation.id
        );

      return NextResponse.json(
        {
          success: false,
          code: "EXPIRED",
          message:
            "This SoccaR account activation link has expired.",
        },
        { status: 410 }
      );
    }

    const memberRelation =
      activation.soccar_members;

    const member =
      Array.isArray(
        memberRelation
      )
        ? memberRelation[0]
        : memberRelation;

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The authorised SoccaR member record could not be found.",
        },
        { status: 500 }
      );
    }

    if (
      member.account_status !==
      "PENDING_ACTIVATION"
    ) {
      return NextResponse.json(
        {
          success: false,
          code:
            "ALREADY_ACTIVE",
          message:
            "This SoccaR account has already been activated.",
        },
        { status: 409 }
      );
    }

    /*
     * 2. Create the authorised
     * Supabase Auth user.
     *
     * Admin API remains server-only.
     */
    const {
      data: authData,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.createUser(
        {
          email: member.email,
          password,
          email_confirm: true,
          user_metadata: {
            first_name:
              member.first_name,
            last_name:
              member.last_name,
          },
        }
      );

    if (
      authError ||
      !authData.user
    ) {
      console.error(
        "Supabase Auth user creation error:",
        authError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not activate your SoccaR login right now.",
        },
        { status: 500 }
      );
    }

    /*
     * 3. Link the Auth identity
     * to the existing SoccaR member.
     */
    const {
      data: memberId,
      error: completionError,
    } =
      await supabaseAdmin.rpc(
        "complete_soccar_account_activation",
        {
          p_token_hash:
            tokenHash,
          p_auth_user_id:
            authData.user.id,
        }
      );

    if (
      completionError ||
      !memberId
    ) {
      console.error(
        "SoccaR account activation completion error:",
        completionError
      );

      /*
       * Roll back the Auth user
       * so an orphan account is
       * not left behind.
       */
      await supabaseAdmin.auth.admin.deleteUser(
        authData.user.id
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Your login could not be linked to your SoccaR membership.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        memberId,
        message:
          "Your SoccaR account has been activated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "SoccaR account activation route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened while activating your SoccaR account.",
      },
      { status: 500 }
    );
  }
}