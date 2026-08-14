"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

type VerificationState =
  | "verifying"
  | "success"
  | "expired"
  | "inactive"
  | "invalid"
  | "issuance-pending"
  | "error";

type VerifyResponse = {
  success: boolean;
  founderNumber?: number;
  status?: string;
  code?: string;
  message?: string;
};

function formatFounderNumber(value: number) {
  return String(value).padStart(5, "0");
}

function CheckIcon({
  size = 18,
}: {
  size?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function VerifyClient() {
  const searchParams = useSearchParams();

  const token =
    searchParams.get("token");

  /*
   * DEVELOPMENT-ONLY SUCCESS PREVIEW
   *
   * http://localhost:3000/founder/verify?preview=success
   *
   * Does not verify a token, issue another
   * Founder Number or alter Supabase data.
   */
  const previewSuccess =
    process.env.NODE_ENV === "development" &&
    searchParams.get("preview") === "success";

  const verificationStartedRef =
    useRef(false);

  const [state, setState] =
    useState<VerificationState>(
      previewSuccess
        ? "success"
        : "verifying"
    );

  const [message, setMessage] =
    useState(
      previewSuccess
        ? "Your SoccaR Founding Membership is now active."
        : "Verifying your Founding Membership…"
    );

  const [
    founderNumber,
    setFounderNumber,
  ] = useState<number | null>(
    previewSuccess ? 8 : null
  );

  useEffect(() => {
    if (previewSuccess) {
      return;
    }

    if (
      verificationStartedRef.current
    ) {
      return;
    }

    verificationStartedRef.current =
      true;

    async function verifyFounder() {
      if (!token) {
        setState("invalid");

        setMessage(
          "We could not verify this link. Please request a new verification email."
        );

        return;
      }

      try {
        const response =
          await fetch(
            "/api/founder/verify",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                token,
              }),
            }
          );

        const result =
          (await response.json()) as VerifyResponse;

        if (
          response.ok &&
          result.success &&
          result.founderNumber
        ) {
          setFounderNumber(
            result.founderNumber
          );

          setState("success");

          setMessage(
            "Your SoccaR Founding Membership is now active."
          );

          return;
        }

        if (
          result.code === "EXPIRED"
        ) {
          setState("expired");

          setMessage(
            result.message ||
              "This verification link has expired. Your reservation is still secure."
          );

          return;
        }

        if (
          result.code ===
          "USED_OR_REVOKED"
        ) {
          setState("inactive");

          setMessage(
            result.message ||
              "This verification link is no longer active."
          );

          return;
        }

        if (
          result.code ===
          "ISSUANCE_PENDING"
        ) {
          setState(
            "issuance-pending"
          );

          setMessage(
            result.message ||
              "Your email has been verified, but Founder activation is still being completed."
          );

          return;
        }

        if (
          result.code === "INVALID"
        ) {
          setState("invalid");

          setMessage(
            result.message ||
              "We could not verify this link."
          );

          return;
        }

        setState("error");

        setMessage(
          result.message ||
            "Something unexpected happened while verifying your Founding Membership."
        );
      } catch (error) {
        console.error(
          "Founder verification page error:",
          error
        );

        setState("error");

        setMessage(
          "Something unexpected happened while verifying your Founding Membership."
        );
      }
    }

    verifyFounder();
  }, [token, previewSuccess]);

  return (
    <main
      className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white"
      style={{
        width: "100%",
      }}
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 22% 27%, rgba(156,229,0,0.05) 0%, rgba(156,229,0,0) 30%), radial-gradient(circle at 82% 16%, rgba(156,229,0,0.035) 0%, rgba(156,229,0,0) 28%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-210px] top-[-210px] h-[520px] w-[520px] rounded-full border border-[#9CE500]/[0.045]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-145px] top-[-145px] h-[390px] w-[390px] rounded-full border border-[#9CE500]/[0.04]"
      />

      <section
        className="relative z-10 w-full"
        style={{
          padding:
            "clamp(28px, 3.4vw, 52px) clamp(24px, 6vw, 96px) clamp(54px, 6vw, 88px)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1380px",
            margin: "0 auto",
          }}
        >
          {/* Brand */}
          <header className="text-center">
            <div
              className="font-extrabold text-[#9CE500]"
              style={{
                fontSize:
                  "clamp(0.84rem, 1vw, 0.98rem)",
                lineHeight: "1",
                letterSpacing: "0.48em",
              }}
            >
              SOCCAR
            </div>

            <div
              className="uppercase text-white/40"
              style={{
                marginTop: "9px",
                fontSize: "0.59rem",
                lineHeight: "1",
                fontWeight: 600,
                letterSpacing: "0.36em",
              }}
            >
              Founding Community
            </div>
          </header>

          {/* Verifying */}
          {state === "verifying" && (
            <div
              className="mx-auto flex max-w-2xl flex-col items-center justify-center text-center"
              style={{
                minHeight: "610px",
              }}
            >
              <div className="h-3 w-3 animate-pulse rounded-full bg-[#9CE500]" />

              <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.32em] text-[#9CE500]">
                Founding Membership
              </p>

              <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Verifying your membership…
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/50">
                We&apos;re confirming your email
                and securing your place in the
                SoccaR Founding Community.
              </p>
            </div>
          )}

          {/* Success */}
          {state === "success" &&
            founderNumber !== null && (
              <div
                style={{
                  marginTop:
                    "clamp(50px, 5vw, 76px)",
                }}
              >
                {/* Founder reveal */}
                <div
                  className="grid grid-cols-1 lg:grid-cols-2"
                  style={{
                    minHeight: "330px",
                  }}
                >
                  {/* Left column */}
                  <section
                    className="relative flex flex-col justify-center"
                    style={{
                      paddingRight:
                        "clamp(0px, 5vw, 72px)",
                      paddingBottom:
                        "clamp(40px, 4vw, 58px)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#9CE500]/60 bg-[#9CE500]/[0.055] text-[#9CE500]">
                        <CheckIcon />
                      </div>

                      <p
                        className="font-extrabold uppercase text-[#9CE500]"
                        style={{
                          fontSize: "0.66rem",
                          lineHeight: "1.2",
                          letterSpacing:
                            "0.26em",
                        }}
                      >
                        Membership Activated
                      </p>
                    </div>

                    <h1
                      className="font-semibold text-white"
                      style={{
                        maxWidth: "620px",
                        marginTop: "25px",
                        fontSize:
                          "clamp(2.35rem, 3.65vw, 3.8rem)",
                        lineHeight: "1.045",
                        letterSpacing:
                          "-0.045em",
                        textWrap: "balance",
                      }}
                    >
                      Welcome to the
                      <br />
                      Founding Community.
                    </h1>

                    <div
                      aria-hidden="true"
                      className="bg-[#9CE500]"
                      style={{
                        width: "78px",
                        height: "1px",
                        marginTop: "27px",
                      }}
                    />

                    <p
                      className="text-white/62"
                      style={{
                        maxWidth: "590px",
                        marginTop: "24px",
                        fontSize:
                          "clamp(0.9rem, 1.15vw, 1rem)",
                        lineHeight: "1.72",
                      }}
                    >
                      Your email has been verified
                      and your place in the SoccaR
                      Founding Community is now
                      secure.
                    </p>

                    <p
                      className="text-white/43"
                      style={{
                        maxWidth: "600px",
                        marginTop: "16px",
                        fontSize:
                          "clamp(0.84rem, 1vw, 0.94rem)",
                        lineHeight: "1.72",
                      }}
                    >
                      You are part of the earliest
                      chapter of SoccaR and your
                      Founder identity has now been
                      permanently established.
                    </p>
                  </section>

                  {/* Right column */}
                  <section
                    className="relative flex flex-col justify-center border-t border-white/[0.08] lg:border-l lg:border-t-0"
                    style={{
                      paddingTop:
                        "clamp(40px, 4vw, 58px)",
                      paddingBottom:
                        "clamp(40px, 4vw, 58px)",
                      paddingLeft:
                        "clamp(0px, 6vw, 86px)",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute hidden rounded-full bg-[#9CE500] lg:block"
                      style={{
                        left: "-5px",
                        top: "50%",
                        width: "10px",
                        height: "10px",
                        transform:
                          "translateY(-50%)",
                        boxShadow:
                          "0 0 26px rgba(156,229,0,0.95)",
                      }}
                    />

                    <p
                      className="font-bold uppercase text-white/42"
                      style={{
                        fontSize: "0.62rem",
                        lineHeight: "1.2",
                        letterSpacing:
                          "0.28em",
                      }}
                    >
                      Your Permanent Founder Number
                    </p>

                    <div
                      className="whitespace-nowrap font-semibold"
                      style={{
                        marginTop: "22px",
                        fontSize:
                          "clamp(3.8rem, 5.7vw, 6rem)",
                        lineHeight: "0.9",
                        letterSpacing:
                          "-0.06em",
                      }}
                    >
                      <span className="text-[#9CE500]">
                        #
                      </span>

                      <span className="text-white">
                        {formatFounderNumber(
                          founderNumber
                        )}
                      </span>
                    </div>

                    <div
                      aria-hidden="true"
                      style={{
                        width: "56px",
                        height: "1px",
                        marginTop: "31px",
                        background:
                          "rgba(156,229,0,0.72)",
                      }}
                    />

                    <p
                      className="font-semibold text-[#9CE500]"
                      style={{
                        marginTop: "25px",
                        fontSize:
                          "clamp(0.92rem, 1.15vw, 1.04rem)",
                        lineHeight: "1.5",
                      }}
                    >
                      You were here at the beginning.
                    </p>

                    <p
                      className="text-white/43"
                      style={{
                        maxWidth: "430px",
                        marginTop: "12px",
                        fontSize:
                          "clamp(0.84rem, 0.98vw, 0.93rem)",
                        lineHeight: "1.72",
                      }}
                    >
                      This number is permanent and
                      will remain part of your
                      SoccaR Founder identity.
                    </p>
                  </section>
                </div>

                {/* Status band */}
                <section
                  className="border-y border-white/[0.09]"
                  style={{
                    marginTop:
                      "clamp(10px, 1.5vw, 22px)",
                    padding:
                      "clamp(19px, 1.8vw, 26px) 0",
                  }}
                >
                  <div className="grid grid-cols-1 gap-y-7 sm:grid-cols-3 sm:gap-y-0">
                    {[
                      {
                        label:
                          "Place Reserved",
                        value: "Complete",
                      },
                      {
                        label:
                          "Email Verified",
                        value: "Complete",
                      },
                      {
                        label:
                          "Founder Identity",
                        value: "Active",
                      },
                    ].map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            item.label
                          }
                          className={
                            index < 2
                              ? "flex items-center justify-center gap-4 sm:border-r sm:border-white/[0.09]"
                              : "flex items-center justify-center gap-4"
                          }
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#9CE500]/55 text-[#9CE500]">
                            <CheckIcon
                              size={17}
                            />
                          </div>

                          <div>
                            <p
                              className="font-bold uppercase text-white/80"
                              style={{
                                fontSize:
                                  "0.62rem",
                                lineHeight:
                                  "1.3",
                                letterSpacing:
                                  "0.16em",
                              }}
                            >
                              {item.label}
                            </p>

                            <p
                              className="text-white/45"
                              style={{
                                marginTop:
                                  "5px",
                                fontSize:
                                  "0.78rem",
                              }}
                            >
                              {item.value}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </section>

                {/* Final step */}
                <section
                  className="overflow-hidden rounded-[22px] border border-[#9CE500]/25"
                  style={{
                    marginTop:
                      "clamp(24px, 2.5vw, 36px)",
                    background:
                      "linear-gradient(100deg, rgba(13,23,5,0.98) 0%, rgba(8,16,3,0.96) 58%, rgba(9,15,5,0.96) 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(156,229,0,0.035), 0 22px 65px rgba(0,0,0,0.18)",
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[150px_1fr_280px]">
                    {/* Mail icon */}
                    <div
                      className="flex items-center justify-center border-b border-white/[0.07] lg:border-b-0 lg:border-r"
                      style={{
                        padding:
                          "clamp(24px, 2.5vw, 36px)",
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-full border border-[#9CE500]/75 text-[#9CE500]"
                        style={{
                          width: "78px",
                          height: "78px",
                          background:
                            "radial-gradient(circle, rgba(156,229,0,0.08), rgba(0,0,0,0) 68%)",
                          boxShadow:
                            "0 0 32px rgba(156,229,0,0.1)",
                        }}
                      >
                        <MailIcon />
                      </div>
                    </div>

                    {/* Copy */}
                    <div
                      style={{
                        padding:
                          "clamp(26px, 2.8vw, 40px) clamp(26px, 3vw, 42px)",
                      }}
                    >
                      <p
                        className="font-extrabold uppercase text-[#9CE500]"
                        style={{
                          fontSize: "0.63rem",
                          lineHeight: "1.2",
                          letterSpacing:
                            "0.28em",
                        }}
                      >
                        One Final Step
                      </p>

                      <h2
                        className="font-semibold text-white"
                        style={{
                          marginTop: "13px",
                          fontSize:
                            "clamp(1.55rem, 2.15vw, 2.05rem)",
                          lineHeight: "1.15",
                          letterSpacing:
                            "-0.035em",
                        }}
                      >
                        Activate your SoccaR
                        account.
                      </h2>

                      <p
                        className="text-white/53"
                        style={{
                          maxWidth: "640px",
                          marginTop: "14px",
                          fontSize:
                            "clamp(0.84rem, 0.98vw, 0.93rem)",
                          lineHeight: "1.7",
                        }}
                      >
                        We&apos;ve sent a secure
                        activation link to your email.
                        Create your password to access
                        your Founder Dashboard.
                      </p>
                    </div>

                    {/* Action */}
                    <div
                      className="flex items-center border-t border-white/[0.07] lg:border-l lg:border-t-0"
                      style={{
                        padding:
                          "clamp(26px, 2.8vw, 40px)",
                      }}
                    >
                      <div className="w-full">
                        <p
                          className="font-bold uppercase text-[#9CE500]"
                          style={{
                            fontSize:
                              "0.74rem",
                            lineHeight:
                              "1.4",
                            letterSpacing:
                              "0.14em",
                          }}
                        >
                          Check your inbox
                          <span
                            style={{
                              marginLeft:
                                "14px",
                            }}
                          >
                            →
                          </span>
                        </p>

                        <div
                          style={{
                            width: "100%",
                            height: "1px",
                            marginTop:
                              "18px",
                            background:
                              "rgba(156,229,0,0.24)",
                          }}
                        />

                        <p
                          className="text-white/35"
                          style={{
                            marginTop:
                              "16px",
                            fontSize:
                              "0.73rem",
                            lineHeight:
                              "1.65",
                          }}
                        >
                          Your Founder Number is
                          already secured.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Clean closing */}
                <footer
                  className="text-center"
                  style={{
                    paddingTop:
                      "clamp(30px, 3.5vw, 48px)",
                    paddingBottom:
                      "clamp(10px, 1.5vw, 20px)",
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="mx-auto h-px"
                    style={{
                      width:
                        "clamp(140px, 20vw, 300px)",
                      background:
                        "linear-gradient(90deg, transparent, rgba(156,229,0,0.32), transparent)",
                    }}
                  />

                  <p
                    className="font-semibold uppercase text-white/28"
                    style={{
                      marginTop: "18px",
                      fontSize: "0.6rem",
                      lineHeight: "1.3",
                      letterSpacing:
                        "0.34em",
                    }}
                  >
                    Welcome to the beginning.
                  </p>
                </footer>
              </div>
            )}

          {/* Non-success states */}
          {state !== "verifying" &&
            state !== "success" && (
              <div
                className="mx-auto flex max-w-2xl flex-col items-center justify-center text-center"
                style={{
                  minHeight: "610px",
                }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-white/60">
                  !
                </div>

                <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
                  Founding Membership
                </p>

                <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  {state === "expired"
                    ? "Verification link expired"
                    : state === "inactive"
                    ? "Verification already used"
                    : state ===
                      "issuance-pending"
                    ? "Email verified"
                    : "We couldn’t verify this link"}
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/50">
                  {message}
                </p>
              </div>
            )}
        </div>
      </section>
    </main>
  );
}