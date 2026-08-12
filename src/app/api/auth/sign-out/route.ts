import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase =
      await createClient();

    const {
      error,
    } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "SoccaR sign-out error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not sign you out right now.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "SoccaR sign-out route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened while signing you out.",
      },
      {
        status: 500,
      }
    );
  }
}