import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type TurnstileVerifyResponse = {
  success: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      country,
      memberType,
      turnstileToken,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !country ||
      !memberType ||
      !turnstileToken
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!turnstileSecret || !supabaseUrl || !supabaseSecretKey) {
      console.error("Missing required server environment variables.");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error.",
        },
        { status: 500 }
      );
    }

    const turnstileFormData = new FormData();

    turnstileFormData.append("secret", turnstileSecret);
    turnstileFormData.append("response", turnstileToken);

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: turnstileFormData,
      }
    );

    const turnstileResult =
      (await turnstileResponse.json()) as TurnstileVerifyResponse;

    if (!turnstileResult.success) {
      console.error(
        "Turnstile verification failed:",
        turnstileResult["error-codes"]
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Security verification failed. Please refresh the page and try again.",
        },
        { status: 403 }
      );
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseSecretKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data, error } = await supabaseAdmin.rpc(
      "join_waitlist",
      {
        p_first_name: String(firstName).trim(),
        p_last_name: String(lastName).trim(),
        p_email: String(email).trim().toLowerCase(),
        p_country: String(country).trim(),
        p_category: String(memberType).trim(),
      }
    );

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            duplicate: true,
            message:
              "This email address is already part of the SoccaR Founding Community.",
          },
          { status: 409 }
        );
      }

      console.error("Supabase waitlist error:", error);

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not complete your registration right now. Please try again.",
        },
        { status: 500 }
      );
    }

    const founderNumber = Number(data);

    return NextResponse.json(
      {
        success: true,
        founderNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Join waitlist route error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened. Please try again.",
      },
      { status: 500 }
    );
  }
}