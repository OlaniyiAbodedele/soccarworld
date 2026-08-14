import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

    const turnstileSecret =
      process.env.TURNSTILE_SECRET_KEY;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseSecretKey =
      process.env.SUPABASE_SECRET_KEY;

    const resendApiKey =
      process.env.RESEND_API_KEY;

    if (
      !turnstileSecret ||
      !supabaseUrl ||
      !supabaseSecretKey ||
      !resendApiKey
    ) {
      console.error(
        "Missing required server environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error.",
        },
        { status: 500 }
      );
    }

    const normalizedFirstName =
      String(firstName).trim();

    const normalizedLastName =
      String(lastName).trim();

    const normalizedEmail =
      String(email).trim().toLowerCase();

    const normalizedCountry =
      String(country).trim();

    const normalizedMemberType =
      String(memberType).trim();

    /*
     * 1. Verify Cloudflare Turnstile
     */
    const turnstileFormData = new FormData();

    turnstileFormData.append(
      "secret",
      turnstileSecret
    );

    turnstileFormData.append(
      "response",
      turnstileToken
    );

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

    /*
     * 2. Create secure Supabase server client
     */
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

    /*
     * 3. Check existing reservation
     */
    const {
      data: existingReservation,
      error: existingReservationError,
    } = await supabaseAdmin
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

    if (
      existingReservation?.status === "CONVERTED"
    ) {
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

    if (
      existingReservation &&
      existingReservation.status !==
        "PENDING_VERIFICATION"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This Founding Membership has already progressed beyond email verification.",
        },
        { status: 409 }
      );
    }

    /*
     * 4. Create or update pending reservation
     */
    const {
      data: reservationId,
      error: reservationError,
    } = await supabaseAdmin.rpc(
      "create_founder_reservation",
      {
        p_first_name: normalizedFirstName,
        p_last_name: normalizedLastName,
        p_email: normalizedEmail,
        p_country: normalizedCountry,
        p_member_type: normalizedMemberType,
        p_referral_token: null,
      }
    );

    if (
      reservationError ||
      !reservationId
    ) {
      console.error(
        "Founder reservation error:",
        reservationError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not secure your Founding Membership reservation right now. Please try again.",
        },
        { status: 500 }
      );
    }

    /*
     * 5. Create secure single-use token
     */
    const verificationToken =
      randomBytes(32).toString("hex");

    const tokenHash = createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() + 60 * 60 * 1000
    ).toISOString();

    /*
     * 6. Store token hash
     */
    const {
      error: verificationError,
    } = await supabaseAdmin.rpc(
      "create_founder_verification",
      {
        p_reservation_id: reservationId,
        p_token_hash: tokenHash,
        p_expires_at: expiresAt,
      }
    );

    if (verificationError) {
      console.error(
        "Founder verification creation error:",
        verificationError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Your place was reserved, but we could not prepare your verification email. Please try again.",
        },
        { status: 500 }
      );
    }

    /*
     * 7. Build verification URL
     *
     * IMPORTANT:
     * Do not use request.url origin here because a Next.js
     * development server bound to 0.0.0.0 can produce
     * http://0.0.0.0:3000 in outgoing email links.
     *
     * Instead use the actual Host header received from the browser.
     */
    const forwardedHost =
      request.headers.get("x-forwarded-host");

    const requestHost =
      forwardedHost ||
      request.headers.get("host");

    const forwardedProtocol =
      request.headers.get("x-forwarded-proto");

    const isLocalDevelopmentHost =
      requestHost?.startsWith("localhost") ||
      requestHost?.startsWith("127.") ||
      requestHost?.startsWith("192.168.") ||
      requestHost?.startsWith("10.") ||
      requestHost?.startsWith("172.");

    const protocol =
      forwardedProtocol ||
      (isLocalDevelopmentHost
        ? "http"
        : "https");

    if (!requestHost) {
      console.error(
        "Unable to determine public request host for Founder verification email."
      );

      return NextResponse.json(
        {
          success: false,
          reservationCreated: true,
          message:
            "Your place has been reserved, but we could not prepare the verification link. Please try again.",
        },
        { status: 500 }
      );
    }

    const siteOrigin =
      `${protocol}://${requestHost}`;

    const verificationUrl =
      `${siteOrigin}/founder/verify` +
      `?token=${encodeURIComponent(
        verificationToken
      )}`;

    /*
     * 8. Send premium SoccaR verification email
     */
    const resend =
      new Resend(resendApiKey);

    const {
      error: emailError,
    } = await resend.emails.send({
      from:
        "SoccaR Founding Community <members@founders.soccarworld.com>",

      to: [normalizedEmail],

      replyTo:
        "admin@soccarworld.com",

      subject:
        "Verify your SoccaR Founding Membership",

      text: [
        `Hello ${normalizedFirstName},`,
        "",
        "Your place in the SoccaR Founding Community has been reserved.",
        "",
        "Verify your email address to activate your Founding Membership and receive your permanent Founder Number.",
        "",
        verificationUrl,
        "",
        "FOUNDING MEMBERSHIP STATUS",
        "Place Reserved: Complete",
        "Email Verification: Pending",
        "Founder Number: Issued after verification",
        "",
        "For your security, this verification link expires in 60 minutes.",
        "If the link expires, your reservation remains secure and you can request another verification email.",
        "",
        "If you did not reserve a SoccaR Founding Membership, you can safely ignore this email.",
        "",
        "SoccaR",
        "The Global Football Community Platform",
        "soccarworld.com",
      ].join("\n"),

      html: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />
  <title>
    Verify your SoccaR Founding Membership
  </title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#070707;
    color:#ffffff;
    font-family:
      Arial,
      Helvetica,
      sans-serif;
  "
>
  <div
    style="
      display:none;
      max-height:0;
      overflow:hidden;
      opacity:0;
      color:transparent;
    "
  >
    Your place in the SoccaR Founding Community
    has been reserved. Verify your email to
    activate your membership.
  </div>

  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="
      width:100%;
      background:#070707;
    "
  >
    <tr>
      <td
        align="center"
        style="
          padding:
            48px
            20px;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            width:100%;
            max-width:640px;
          "
        >

          <tr>
            <td
              align="center"
              style="
                padding:
                  0
                  0
                  34px;
                text-align:center;
              "
            >
              <div
                style="
                  color:#9CE500;
                  font-size:22px;
                  line-height:1;
                  font-weight:800;
                  letter-spacing:7px;
                  text-align:center;
                "
              >
                SOCCAR
              </div>

              <div
                style="
                  margin-top:12px;
                  color:#8d8d8d;
                  font-size:10px;
                  line-height:1.4;
                  font-weight:700;
                  letter-spacing:3.5px;
                  text-transform:uppercase;
                  text-align:center;
                "
              >
                FOUNDING COMMUNITY
              </div>
            </td>
          </tr>

          <tr>
            <td
              style="
                background:#111111;
                border:1px solid #242424;
                border-radius:24px;
                overflow:hidden;
              "
            >
              <div
                style="
                  height:4px;
                  background:#9CE500;
                  line-height:4px;
                  font-size:1px;
                "
              >
                &nbsp;
              </div>

              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
              >
                <tr>
                  <td
                    style="
                      padding:
                        46px
                        46px
                        0;
                    "
                  >
                    <div
                      style="
                        color:#9CE500;
                        font-size:11px;
                        font-weight:800;
                        letter-spacing:2.5px;
                        text-transform:uppercase;
                      "
                    >
                      Place Reserved
                    </div>

                    <h1
                      style="
                        margin:
                          14px
                          0
                          0;
                        color:#ffffff;
                        font-size:38px;
                        line-height:1.12;
                        letter-spacing:-1.5px;
                        font-weight:700;
                      "
                    >
                      Your place in football&apos;s
                      next chapter is reserved.
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:
                        28px
                        46px
                        0;
                      color:#d2d2d2;
                      font-size:16px;
                      line-height:1.75;
                    "
                  >
                    Hello ${normalizedFirstName},
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:
                        12px
                        46px
                        0;
                      color:#a8a8a8;
                      font-size:16px;
                      line-height:1.75;
                    "
                  >
                    Thank you for reserving your place
                    in the SoccaR Founding Community.
                    Your reservation is secure.
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:
                        15px
                        46px
                        0;
                      color:#a8a8a8;
                      font-size:16px;
                      line-height:1.75;
                    "
                  >
                    Verify your email address to
                    activate your Founding Membership
                    and receive your permanent
                    Founder Number.
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      padding:
                        34px
                        46px
                        0;
                      text-align:center;
                    "
                  >
                    <a
                      href="${verificationUrl}"
                      style="
                        display:inline-block;
                        background:#9CE500;
                        color:#070707;
                        text-decoration:none;
                        font-size:14px;
                        line-height:1;
                        font-weight:800;
                        letter-spacing:0.4px;
                        padding:
                          18px
                          28px;
                        border-radius:999px;
                      "
                    >
                      VERIFY MY EMAIL
                    </a>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:
                        38px
                        46px
                        0;
                    "
                  >
                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        background:#0b0b0b;
                        border:1px solid #232323;
                        border-radius:16px;
                      "
                    >
                      <tr>
                        <td
                          colspan="2"
                          style="
                            padding:
                              22px
                              24px
                              14px;
                            color:#777777;
                            font-size:10px;
                            font-weight:800;
                            letter-spacing:2px;
                            text-transform:uppercase;
                          "
                        >
                          Founding Membership Status
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding:
                              12px
                              24px;
                            color:#b8b8b8;
                            font-size:14px;
                            border-top:1px solid #202020;
                          "
                        >
                          Place Reserved
                        </td>

                        <td
                          align="right"
                          style="
                            padding:
                              12px
                              24px;
                            color:#9CE500;
                            font-size:14px;
                            font-weight:700;
                            border-top:1px solid #202020;
                          "
                        >
                          COMPLETE ✓
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding:
                              12px
                              24px;
                            color:#b8b8b8;
                            font-size:14px;
                            border-top:1px solid #202020;
                          "
                        >
                          Email Verification
                        </td>

                        <td
                          align="right"
                          style="
                            padding:
                              12px
                              24px;
                            color:#ffffff;
                            font-size:14px;
                            font-weight:700;
                            border-top:1px solid #202020;
                          "
                        >
                          PENDING
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding:
                              12px
                              24px
                              18px;
                            color:#b8b8b8;
                            font-size:14px;
                            border-top:1px solid #202020;
                          "
                        >
                          Founder Number
                        </td>

                        <td
                          align="right"
                          style="
                            padding:
                              12px
                              24px
                              18px;
                            color:#777777;
                            font-size:13px;
                            font-weight:700;
                            border-top:1px solid #202020;
                          "
                        >
                          AFTER VERIFICATION
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:
                        32px
                        46px
                        0;
                    "
                  >
                    <div
                      style="
                        color:#ffffff;
                        font-size:13px;
                        font-weight:700;
                        margin-bottom:8px;
                      "
                    >
                      Secure verification
                    </div>

                    <div
                      style="
                        color:#7f7f7f;
                        font-size:13px;
                        line-height:1.7;
                      "
                    >
                      This secure verification link
                      expires in 60 minutes. If it
                      expires, your reservation remains
                      secure and you can request a new
                      verification email.
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:
                        24px
                        46px
                        0;
                      color:#666666;
                      font-size:12px;
                      line-height:1.7;
                      word-break:break-all;
                    "
                  >
                    If the button does not work, copy
                    and paste this secure link into
                    your browser:
                    <br /><br />

                    <a
                      href="${verificationUrl}"
                      style="
                        color:#9CE500;
                        text-decoration:none;
                      "
                    >
                      ${verificationUrl}
                    </a>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:
                        28px
                        46px
                        46px;
                      color:#666666;
                      font-size:12px;
                      line-height:1.7;
                    "
                  >
                    If you did not reserve a SoccaR
                    Founding Membership, you can safely
                    ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td
              style="
                padding:
                  28px
                  12px
                  0;
                text-align:center;
                color:#555555;
                font-size:11px;
                line-height:1.8;
              "
            >
              <div
                style="
                  color:#777777;
                  font-weight:700;
                  letter-spacing:1.5px;
                "
              >
                SOCCAR
              </div>

              <div>
                The Global Football Community Platform
              </div>

              <div
                style="
                  margin-top:8px;
                "
              >
                soccarworld.com
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (emailError) {
      console.error(
        "Founder verification email error:",
        emailError
      );

      return NextResponse.json(
        {
          success: false,
          reservationCreated: true,
          message:
            "Your place has been reserved, but we could not send your verification email. Please try again.",
        },
        { status: 500 }
      );
    }

    /*
     * 9. Return confirmation
     */
    return NextResponse.json(
      {
        success: true,
        reservationId,
        status: "PENDING_VERIFICATION",
        email: normalizedEmail,
        verificationEmailSent: true,
        message:
          "Your place has been reserved. Check your email to activate your Founding Membership.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Founder reservation route error:",
      error
    );

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