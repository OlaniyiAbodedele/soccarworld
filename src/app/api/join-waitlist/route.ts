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

    const normalizedEmail = String(email).trim().toLowerCase();

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

    const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: existingReservation, error: existingReservationError } =
      await supabaseAdmin
        .from("founder_reservations")
        .select("id, status, email")
        .eq("email", normalizedEmail)
        .maybeSingle();

    if (existingReservationError) {
      console.error(
        "Founder reservation lookup error:",
        existingReservationError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not check your reservation right now. Please try again.",
        },
        { status: 500 }
      );
    }

    if (existingReservation?.status === "CONVERTED") {
      return NextResponse.json(
        {
          success: false,
          alreadyFounder: true,
          message:
            "This email address already has an active SoccaR Founding Membership.",
        },
        { status: 409 }
      );
    }

    const { data: reservationId, error: reservationError } =
      await supabaseAdmin.rpc("create_founder_reservation", {
        p_first_name: String(firstName).trim(),
        p_last_name: String(lastName).trim(),
        p_email: normalizedEmail,
        p_country: String(country).trim(),
        p_member_type: String(memberType).trim(),
        p_referral_token: null,
      });

    if (reservationError) {
      console.error("Founder reservation error:", reservationError);

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not secure your Founding Membership reservation right now. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        reservationId,
        status: "PENDING_VERIFICATION",
        email: normalizedEmail,
        message:
          "Your place has been reserved. Verify your email to activate your Founding Membership.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Founder reservation route error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something unexpected happened. Please try again.",
      },
      { status: 500 }
    );
  }
}