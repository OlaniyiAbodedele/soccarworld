import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(
      body?.email ?? ""
    )
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter the email address connected to your SoccaR account.",
        },
        { status: 400 }
      );
    }

    const supabase =
      await createClient();

    const requestUrl =
      new URL(request.url);

    const redirectTo =
      `${requestUrl.origin}/reset-password`;

    const {
      error,
    } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo,
        }
      );

    if (error) {
      console.error(
        "SoccaR password reset request error:",
        error
      );

      /*
       * Privacy protection:
       * Do not reveal whether an account exists.
       *
       * We still return a neutral success response
       * so the recovery screen behaves consistently.
       */
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "If this email is connected to a SoccaR account, password reset instructions have been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "SoccaR forgot-password route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened while processing your password reset request.",
      },
      { status: 500 }
    );
  }
}