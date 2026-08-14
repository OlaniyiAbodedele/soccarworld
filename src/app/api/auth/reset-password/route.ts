import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const password = String(
      body?.password ?? ""
    );

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter your new SoccaR password.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your new password must contain at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const supabase =
      await createClient();

    /*
     * A valid Supabase recovery link establishes
     * a temporary recovery session in the browser.
     * This route relies on that authenticated
     * recovery session before allowing a password
     * change.
     */
    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your password reset session is invalid or has expired. Please request a new reset link.",
        },
        { status: 401 }
      );
    }

    const {
      error: updateError,
    } =
      await supabase.auth.updateUser({
        password,
      });

    if (updateError) {
      console.error(
        "SoccaR password update error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not update your password right now. Please request a new reset link and try again.",
        },
        { status: 500 }
      );
    }

    /*
     * End the recovery session after the password
     * has been changed successfully.
     */
    const {
      error: signOutError,
    } =
      await supabase.auth.signOut();

    if (signOutError) {
      console.error(
        "SoccaR post-reset sign-out error:",
        signOutError
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Your SoccaR password has been updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "SoccaR reset-password route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened while updating your password.",
      },
      { status: 500 }
    );
  }
}