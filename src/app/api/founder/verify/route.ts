import {
  createHash,
  randomBytes,
} from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function formatFounderNumber(value: number) {
  return `#${String(value).padStart(5, "0")}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token = String(
      body?.token ?? ""
    ).trim();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification token is required.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseSecretKey =
      process.env.SUPABASE_SECRET_KEY;

    const resendApiKey =
      process.env.RESEND_API_KEY;

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.trim();

    if (
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
          message:
            "Server configuration error.",
        },
        { status: 500 }
      );
    }

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

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
     * 1. Verify Founding Membership
     * email token.
     */
    const {
      data: reservationId,
      error: verificationError,
    } = await supabaseAdmin.rpc(
      "verify_founder_email",
      {
        p_token_hash: tokenHash,
      }
    );

    if (
      verificationError ||
      !reservationId
    ) {
      console.error(
        "Founder email verification error:",
        verificationError
      );

      const errorMessage =
        verificationError?.message ?? "";

      if (
        errorMessage.includes(
          "Verification link has expired"
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            code: "EXPIRED",
            message:
              "This verification link has expired. Your reservation is still secure.",
          },
          { status: 410 }
        );
      }

      if (
        errorMessage.includes(
          "Verification link is no longer active"
        )
      ) {
        const {
          data: usedVerification,
          error: usedVerificationError,
        } = await supabaseAdmin
          .from(
            "founder_email_verifications"
          )
          .select(
            "reservation_id, status"
          )
          .eq("token_hash", tokenHash)
          .maybeSingle();

        if (
          !usedVerificationError &&
          usedVerification?.status ===
            "USED" &&
          usedVerification.reservation_id
        ) {
          const {
            data: existingFounder,
            error: existingFounderError,
          } = await supabaseAdmin
            .from("founder_memberships")
            .select("founder_number")
            .eq(
              "reservation_id",
              usedVerification.reservation_id
            )
            .eq("status", "ACTIVE")
            .maybeSingle();

          if (
            !existingFounderError &&
            existingFounder?.founder_number
          ) {
            return NextResponse.json(
              {
                success: true,
                reservationId:
                  usedVerification.reservation_id,
                founderNumber:
                  existingFounder.founder_number,
                status:
                  "ACTIVE_FOUNDER",
                alreadyVerified: true,
                message:
                  "Your SoccaR Founding Membership is already active.",
              },
              { status: 200 }
            );
          }
        }

        return NextResponse.json(
          {
            success: false,
            code: "USED_OR_REVOKED",
            message:
              "This verification link is no longer active.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          code: "INVALID",
          message:
            "We could not verify this link. Please request a new verification email.",
        },
        { status: 400 }
      );
    }

    /*
     * 2. Issue permanent Founder Number.
     */
    const {
      data: founderNumber,
      error: founderIssuanceError,
    } = await supabaseAdmin.rpc(
      "issue_founder_membership",
      {
        p_reservation_id: reservationId,
      }
    );

    if (
      founderIssuanceError ||
      !founderNumber
    ) {
      console.error(
        "Founder membership issuance error:",
        founderIssuanceError
      );

      return NextResponse.json(
        {
          success: false,
          code: "ISSUANCE_PENDING",
          reservationId,
          message:
            "Your email has been verified, but we could not complete your Founder activation right now. Your place is secure.",
        },
        { status: 503 }
      );
    }

    /*
     * 3. Retrieve Founder Membership UUID.
     */
    const {
      data: founderMembership,
      error: founderMembershipError,
    } = await supabaseAdmin
      .from("founder_memberships")
      .select("id, founder_number")
      .eq("reservation_id", reservationId)
      .eq("founder_number", founderNumber)
      .single();

    let memberId: string | null = null;

    let activationUrl: string | null =
      null;

    let accountActivationReady =
      false;

    if (
      founderMembershipError ||
      !founderMembership
    ) {
      console.error(
        "Founder Membership retrieval error:",
        founderMembershipError
      );
    } else {
      /*
       * 4. Provision permanent SoccaR
       * member record.
       */
      const {
        data: provisionedMemberId,
        error: memberProvisionError,
      } = await supabaseAdmin.rpc(
        "provision_soccar_member_from_founder",
        {
          p_founder_membership_id:
            founderMembership.id,
        }
      );

      if (
        memberProvisionError ||
        !provisionedMemberId
      ) {
        console.error(
          "SoccaR member provisioning error:",
          memberProvisionError
        );
      } else {
        memberId = String(
          provisionedMemberId
        );

        /*
         * 5. Create secure single-use
         * account activation token.
         *
         * Valid for 24 hours.
         */
        const activationToken =
          randomBytes(32).toString(
            "hex"
          );

        const activationTokenHash =
          createHash("sha256")
            .update(activationToken)
            .digest("hex");

        const activationExpiresAt =
          new Date(
            Date.now() +
              24 * 60 * 60 * 1000
          ).toISOString();

        const {
          error:
            activationCreationError,
        } = await supabaseAdmin.rpc(
          "create_soccar_account_activation",
          {
            p_member_id: memberId,
            p_token_hash:
              activationTokenHash,
            p_expires_at:
              activationExpiresAt,
          }
        );

        if (
          activationCreationError
        ) {
          console.error(
            "SoccaR account activation creation error:",
            activationCreationError
          );
        } else if (!appUrl) {
          console.error(
            "NEXT_PUBLIC_APP_URL is not configured."
          );
        } else {
          const cleanAppUrl =
            appUrl.replace(/\/$/, "");

          activationUrl =
            `${cleanAppUrl}` +
            `/account/activate` +
            `?token=${encodeURIComponent(
              activationToken
            )}`;

          accountActivationReady =
            true;
        }
      }
    }

    /*
     * 6. Retrieve verified Founder
     * identity for welcome email.
     */
    const {
      data: reservation,
      error: reservationError,
    } = await supabaseAdmin
      .from("founder_reservations")
      .select(
        `
          first_name,
          last_name,
          email,
          country,
          member_type
        `
      )
      .eq("id", reservationId)
      .single();

    if (
      reservationError ||
      !reservation
    ) {
      console.error(
        "Founder reservation retrieval error:",
        reservationError
      );

      return NextResponse.json(
        {
          success: true,
          reservationId,
          founderNumber,
          memberId,
          status: "ACTIVE_FOUNDER",
          accountActivationReady,
          welcomeEmailSent: false,
          message:
            "Your email has been verified and your SoccaR Founding Membership is active.",
        },
        { status: 200 }
      );
    }

    const founderNumberDisplay =
      formatFounderNumber(
        Number(founderNumber)
      );

    /*
     * 7. Account activation section
     * for welcome email.
     */
    const activationText =
      accountActivationReady &&
      activationUrl
        ? [
            "",
            "ONE FINAL STEP — ACTIVATE YOUR SOCCAR ACCOUNT",
            "",
            "Your Founding Membership is already active and your Founder Number is secured.",
            "",
            "Use the secure link below to activate your SoccaR account and create your sign-in password:",
            "",
            activationUrl,
            "",
            "This account activation link expires in 24 hours.",
          ].join("\n")
        : [
            "",
            "SOCCAR ACCOUNT ACCESS",
            "",
            "Your Founding Membership is active and your Founder Number is secured.",
            "",
            "We are preparing your SoccaR account activation instructions. Your Founder identity is not affected.",
          ].join("\n");

    const activationHtml =
      accountActivationReady &&
      activationUrl
        ? `
<tr>
  <td style="padding:34px 46px 0;">
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="
        background:#101a08;
        border:1px solid rgba(156,229,0,0.28);
        border-radius:16px;
      "
    >
      <tr>
        <td
          align="center"
          style="
            padding:30px 28px;
            text-align:center;
          "
        >
          <div
            style="
              color:#9CE500;
              font-size:10px;
              font-weight:800;
              letter-spacing:2.3px;
              text-transform:uppercase;
            "
          >
            One Final Step
          </div>

          <div
            style="
              margin-top:12px;
              color:#ffffff;
              font-size:24px;
              line-height:1.25;
              font-weight:700;
            "
          >
            Activate your SoccaR account.
          </div>

          <div
            style="
              margin:14px auto 0;
              max-width:470px;
              color:#9a9a9a;
              font-size:14px;
              line-height:1.7;
            "
          >
            Your Founding Membership is already
            active. Create your sign-in password
            to access your Founder Dashboard.
          </div>

          <div style="margin-top:24px;">
            <a
              href="${activationUrl}"
              style="
                display:inline-block;
                background:#9CE500;
                color:#070707;
                text-decoration:none;
                font-size:13px;
                line-height:1;
                font-weight:800;
                letter-spacing:0.5px;
                padding:18px 28px;
                border-radius:999px;
              "
            >
              ACTIVATE MY SOCCAR ACCOUNT
            </a>
          </div>

          <div
            style="
              margin-top:18px;
              color:#666666;
              font-size:11px;
              line-height:1.6;
            "
          >
            This secure activation link expires
            in 24 hours.
          </div>
        </td>
      </tr>
    </table>
  </td>
</tr>

<tr>
  <td
    style="
      padding:24px 46px 0;
      color:#666666;
      font-size:11px;
      line-height:1.7;
      word-break:break-all;
    "
  >
    If the button does not work, copy and paste
    this secure link into your browser:
    <br /><br />

    <a
      href="${activationUrl}"
      style="
        color:#9CE500;
        text-decoration:none;
      "
    >
      ${activationUrl}
    </a>
  </td>
</tr>
        `
        : `
<tr>
  <td style="padding:34px 46px 0;">
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
          style="
            padding:24px;
            color:#8d8d8d;
            font-size:13px;
            line-height:1.7;
          "
        >
          Your Founding Membership is active
          and your Founder Number is secured.
          SoccaR account activation instructions
          are being prepared.
        </td>
      </tr>
    </table>
  </td>
</tr>
        `;

    /*
     * 8. Send Founder Welcome +
     * Account Activation email.
     */
    const resend =
      new Resend(resendApiKey);

    const {
      error: welcomeEmailError,
    } = await resend.emails.send({
      from:
        "SoccaR Founding Community <members@founders.soccarworld.com>",

      to: [reservation.email],

      replyTo:
        "admin@soccarworld.com",

      subject:
        `${founderNumberDisplay} — Welcome to the SoccaR Founding Community`,

      text: [
        `Hello ${reservation.first_name},`,
        "",
        "Welcome to the SoccaR Founding Community.",
        "",
        "Your email has been verified and your Founding Membership is now active.",
        "",
        "YOUR PERMANENT FOUNDER NUMBER",
        founderNumberDisplay,
        "",
        "You were here at the beginning.",
        "",
        "Your Founder Number is permanent. It represents your place in the community that joined SoccaR at its foundation.",
        "",
        "FOUNDING MEMBERSHIP STATUS",
        "Place Reserved: Complete",
        "Email Verified: Complete",
        "Founder Identity: Active",
        activationText,
        "",
        "Welcome to the beginning.",
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
    Welcome to the SoccaR Founding Community
  </title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#070707;
    color:#ffffff;
    font-family:Arial,Helvetica,sans-serif;
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
    Your SoccaR Founding Membership is active.
    Your permanent Founder Number is
    ${founderNumberDisplay}.
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
          padding:48px 20px;
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
                padding:0 0 34px;
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
                    align="center"
                    style="
                      padding:48px 46px 0;
                      text-align:center;
                    "
                  >
                    <div
                      style="
                        color:#9CE500;
                        font-size:11px;
                        font-weight:800;
                        letter-spacing:2.6px;
                        text-transform:uppercase;
                      "
                    >
                      Membership Activated
                    </div>

                    <h1
                      style="
                        margin:16px 0 0;
                        color:#ffffff;
                        font-size:38px;
                        line-height:1.12;
                        letter-spacing:-1.5px;
                        font-weight:700;
                      "
                    >
                      Welcome to the
                      Founding Community.
                    </h1>

                    <div
                      style="
                        margin-top:34px;
                        color:#777777;
                        font-size:10px;
                        font-weight:800;
                        letter-spacing:2.2px;
                        text-transform:uppercase;
                      "
                    >
                      Your Permanent Founder Number
                    </div>

                    <div
                      style="
                        margin-top:10px;
                        color:#ffffff;
                        font-size:58px;
                        line-height:1;
                        font-weight:700;
                        letter-spacing:-2px;
                      "
                    >
                      ${founderNumberDisplay}
                    </div>

                    <div
                      style="
                        margin-top:17px;
                        color:#9CE500;
                        font-size:14px;
                        font-weight:700;
                      "
                    >
                      You were here at the beginning.
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:40px 46px 0;
                      color:#d2d2d2;
                      font-size:16px;
                      line-height:1.75;
                    "
                  >
                    Hello ${reservation.first_name},
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:12px 46px 0;
                      color:#a8a8a8;
                      font-size:16px;
                      line-height:1.75;
                    "
                  >
                    Your email has been verified
                    and your SoccaR Founding
                    Membership is now active.
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:15px 46px 0;
                      color:#a8a8a8;
                      font-size:16px;
                      line-height:1.75;
                    "
                  >
                    Your Founder Number is permanent.
                    It represents your place among the
                    community that joined SoccaR at
                    its foundation.
                  </td>
                </tr>

                <tr>
                  <td style="padding:38px 46px 0;">
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
                            padding:22px 24px 14px;
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
                            padding:12px 24px;
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
                            padding:12px 24px;
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
                            padding:12px 24px;
                            color:#b8b8b8;
                            font-size:14px;
                            border-top:1px solid #202020;
                          "
                        >
                          Email Verified
                        </td>

                        <td
                          align="right"
                          style="
                            padding:12px 24px;
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
                            padding:12px 24px 18px;
                            color:#b8b8b8;
                            font-size:14px;
                            border-top:1px solid #202020;
                          "
                        >
                          Founder Identity
                        </td>

                        <td
                          align="right"
                          style="
                            padding:12px 24px 18px;
                            color:#ffffff;
                            font-size:14px;
                            font-weight:700;
                            border-top:1px solid #202020;
                          "
                        >
                          ACTIVE
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${activationHtml}

                <tr>
                  <td
                    style="
                      padding:32px 46px 0;
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
                      Your Founder identity
                    </div>

                    <div
                      style="
                        color:#7f7f7f;
                        font-size:13px;
                        line-height:1.75;
                      "
                    >
                      As SoccaR grows, your Founder
                      Number will remain part of your
                      member identity and will
                      distinguish your place in the
                      Founding Community.
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    align="center"
                    style="
                      padding:38px 46px 46px;
                      text-align:center;
                    "
                  >
                    <div
                      style="
                        color:#9CE500;
                        font-size:13px;
                        font-weight:700;
                        letter-spacing:0.4px;
                      "
                    >
                      WELCOME TO THE BEGINNING.
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <tr>
            <td
              style="
                padding:28px 12px 0;
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

              <div style="margin-top:8px;">
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

    if (welcomeEmailError) {
      console.error(
        "Founder welcome email error:",
        welcomeEmailError
      );
    }

    /*
     * 9. Return successful Founder
     * activation.
     */
    return NextResponse.json(
      {
        success: true,
        reservationId,
        founderNumber,
        memberId,
        status: "ACTIVE_FOUNDER",
        accountActivationReady,
        welcomeEmailSent:
          !welcomeEmailError,
        message:
          accountActivationReady
            ? "Your email has been verified, your SoccaR Founding Membership is active, and your account activation instructions have been sent."
            : "Your email has been verified and your SoccaR Founding Membership is active.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Founder verification route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something unexpected happened while verifying your Founding Membership.",
      },
      { status: 500 }
    );
  }
}