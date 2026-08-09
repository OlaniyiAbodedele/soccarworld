import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

type SignInRequest = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignInRequest;

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter your SoccaR email address and password.",
        },
        { status: 400 }
      );
    }

    /*
     * 1. Authenticate through the SSR Supabase client.
     *
     * Because this client is cookie-aware, a successful
     * sign-in establishes the member's browser session.
     */
    const supabase = await createClient();

    const {
      data: authData,
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (
      authError ||
      !authData.user ||
      !authData.session
    ) {
      console.error(
        "SoccaR sign-in authentication error:",
        authError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "The email address or password you entered is incorrect.",
        },
        { status: 401 }
      );
    }

    /*
     * 2. Confirm that this Auth identity is linked
     * to an authorised ACTIVE SoccaR member.
     */
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "Missing required Supabase administrative environment variables."
      );

      await supabase.auth.signOut();

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
      .select(
        `
          id,
          auth_user_id,
          first_name,
          last_name,
          email,
          member_type,
          account_status,
          founder_membership_id
        `
      )
      .eq("auth_user_id", authData.user.id)
      .maybeSingle();

    if (memberError) {
      console.error(
        "SoccaR member lookup error:",
        memberError
      );

      await supabase.auth.signOut();

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not verify your SoccaR membership.",
        },
        { status: 500 }
      );
    }

    if (!member) {
      await supabase.auth.signOut();

      return NextResponse.json(
        {
          success: false,
          message:
            "This login is not linked to an authorised SoccaR membership.",
        },
        { status: 403 }
      );
    }

    if (member.account_status !== "ACTIVE") {
      await supabase.auth.signOut();

      return NextResponse.json(
        {
          success: false,
          message:
            "Your SoccaR account is not currently active.",
        },
        { status: 403 }
      );
    }

    /*
     * 3. Authentication and membership checks passed.
     *
     * The Supabase session is now stored through
     * the SSR cookie client.
     */
    return NextResponse.json(
      {
        success: true,
        message: "Welcome back to SoccaR.",
        member: {
          id: member.id,
          firstName: member.first_name,
          lastName: member.last_name,
          memberType: member.member_type,
          founderMembershipId:
            member.founder_membership_id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "SoccaR sign-in route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened while signing you in.",
      },
      { status: 500 }
    );
  }
}