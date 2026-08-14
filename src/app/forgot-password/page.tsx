"use client";

import {
  FormEvent,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

type RecoveryState =
  | "idle"
  | "loading"
  | "success"
  | "error";

type RecoveryResponse = {
  success?: boolean;
  message?: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [state, setState] =
    useState<RecoveryState>("idle");

  const [message, setMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (state === "loading") {
      return;
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setState("error");

      setMessage(
        "Enter the email address connected to your SoccaR account."
      );

      return;
    }

    setState("loading");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/auth/forgot-password",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email: normalizedEmail,
            }),
          }
        );

      const result =
        (await response.json()) as RecoveryResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        setState("error");

        setMessage(
          result.message ||
            "We could not process your password reset request right now."
        );

        return;
      }

      setState("success");

      setMessage(
        "If this email is connected to a SoccaR account, password reset instructions have been sent."
      );
    } catch (error) {
      console.error(
        "SoccaR password recovery request failed:",
        error
      );

      setState("error");

      setMessage(
        "Something unexpected happened. Please try again."
      );
    }
  }

  function clearFeedback() {
    if (state !== "idle") {
      setState("idle");
      setMessage("");
    }
  }

  return (
    <main className="fixed inset-0 overflow-x-hidden overflow-y-auto bg-[#050505] text-white">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 34%, rgba(156,229,0,0.05) 0%, rgba(156,229,0,0) 31%), radial-gradient(circle at 84% 10%, rgba(156,229,0,0.035) 0%, rgba(156,229,0,0) 28%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-190px] top-[-190px] h-[500px] w-[500px] rounded-full border border-[#9CE500]/[0.04]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-125px] top-[-125px] h-[370px] w-[370px] rounded-full border border-[#9CE500]/[0.035]"
      />

      <div
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1280px] flex-col"
        style={{
          padding:
            "clamp(26px, 3vw, 42px) clamp(20px, 5vw, 68px) clamp(30px, 4vw, 56px)",
        }}
      >
        {/* Back */}
        <div>
          <button
            type="button"
            onClick={() =>
              router.push("/sign-in")
            }
            className="inline-flex items-center gap-2 text-[13px] text-white/42 transition hover:text-white"
          >
            <ArrowLeft
              size={17}
              strokeWidth={1.8}
            />

            Back to sign in
          </button>
        </div>

        {/* Brand */}
        <header
          className="text-center"
          style={{
            marginTop:
              "clamp(16px, 2vw, 28px)",
          }}
        >
          <div
            className="font-extrabold text-[#9CE500]"
            style={{
              fontSize:
                "clamp(0.82rem, 1vw, 0.96rem)",
              lineHeight: "1",
              letterSpacing:
                "0.48em",
            }}
          >
            SOCCAR
          </div>

          <div
            className="uppercase text-white/38"
            style={{
              marginTop: "10px",
              fontSize: "0.58rem",
              lineHeight: "1",
              fontWeight: 600,
              letterSpacing:
                "0.36em",
            }}
          >
            Secure Member Access
          </div>
        </header>

        {/* Main content */}
        <section
          className="flex flex-1 items-center justify-center"
          style={{
            padding:
              "clamp(46px, 6vw, 82px) 0",
          }}
        >
          <div className="mx-auto w-full max-w-[720px]">
            <section
              className="overflow-hidden rounded-[30px] border border-white/[0.09]"
              style={{
                background:
                  "linear-gradient(145deg, rgba(15,15,15,0.99) 0%, rgba(10,10,10,0.99) 100%)",
                boxShadow:
                  "0 34px 110px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            >
              {/* Green accent rule */}
              <div className="h-[3px] w-full bg-[#9CE500]" />

              <div
                style={{
                  padding:
                    "clamp(34px, 5vw, 58px) clamp(26px, 5vw, 58px) clamp(32px, 5vw, 50px)",
                }}
              >
                {/* Identity */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#9CE500]/35 bg-[#9CE500]/[0.055] text-[#9CE500]">
                    <Mail
                      size={20}
                      strokeWidth={1.7}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#9CE500]">
                      Password Recovery
                    </p>

                    <p className="mt-2 text-[12px] text-white/32">
                      Secure account access
                    </p>
                  </div>
                </div>

                {/* Hero */}
                <div
                  style={{
                    marginTop:
                      "clamp(32px, 4vw, 44px)",
                  }}
                >
                  <h1
                    className="font-semibold text-white"
                    style={{
                      maxWidth: "590px",
                      fontSize:
                        "clamp(2.45rem, 5vw, 4.25rem)",
                      lineHeight: "1.02",
                      letterSpacing:
                        "-0.05em",
                      textWrap: "balance",
                    }}
                  >
                    Reset your
                    <br />

                    <span className="text-[#9CE500]">
                      SoccaR password.
                    </span>
                  </h1>

                  <div
                    aria-hidden="true"
                    className="bg-[#9CE500]"
                    style={{
                      width: "70px",
                      height: "1px",
                      marginTop: "27px",
                    }}
                  />

                  <p
                    className="text-white/50"
                    style={{
                      maxWidth: "550px",
                      marginTop: "24px",
                      fontSize:
                        "clamp(0.91rem, 1.1vw, 1rem)",
                      lineHeight: "1.75",
                    }}
                  >
                    Enter the email address
                    connected to your SoccaR
                    account. If the account is
                    eligible, we&apos;ll send
                    secure password reset
                    instructions.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  style={{
                    marginTop:
                      "clamp(34px, 4vw, 44px)",
                  }}
                >
                  <div>
                    <label
                      htmlFor="recovery-email"
                      className="block font-medium text-white/72"
                      style={{
                        fontSize: "13px",
                        lineHeight: "1.4",
                        marginLeft: "2px",
                      }}
                    >
                      Email address
                    </label>

                    <input
                      id="recovery-email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(
                          event.target.value
                        );

                        clearFeedback();
                      }}
                      placeholder="Enter your email address"
                      autoComplete="email"
                      className="w-full border border-white/10 bg-[#070707] text-[15px] text-white outline-none transition placeholder:text-white/22 focus:border-[#9CE500]/55 focus:shadow-[0_0_0_1px_rgba(156,229,0,0.13)]"
                      style={{
                        height: "62px",
                        marginTop: "11px",
                        borderRadius: "17px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                    />
                  </div>

                  {/* Feedback */}
                  {message && (
                    <div
                      className={`border ${
                        state === "success"
                          ? "border-[#9CE500]/25 bg-[#9CE500]/[0.055] text-[#c9ff69]"
                          : "border-red-400/20 bg-red-400/[0.055] text-red-200"
                      }`}
                      style={{
                        marginTop: "24px",
                        padding: "15px 17px",
                        borderRadius: "14px",
                        fontSize: "13px",
                        lineHeight: "1.6",
                      }}
                    >
                      {message}
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    type="submit"
                    disabled={
                      state === "loading"
                    }
                    className="flex w-full items-center justify-center bg-[#9CE500] font-extrabold text-[#050505] transition hover:bg-[#a8f500] disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      minHeight: "60px",
                      marginTop: "30px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {state === "loading"
                      ? "SENDING RESET INSTRUCTIONS..."
                      : state === "success"
                        ? "RESET INSTRUCTIONS SENT"
                        : "SEND RESET INSTRUCTIONS"}
                  </button>
                </form>

                {/* Security footer */}
                <div
                  className="border-t border-white/[0.075]"
                  style={{
                    marginTop:
                      "clamp(34px, 4vw, 44px)",
                    paddingTop: "24px",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#9CE500]/20 bg-[#9CE500]/[0.035] text-[#9CE500]">
                      {state === "success" ? (
                        <Check
                          size={16}
                          strokeWidth={2}
                        />
                      ) : (
                        <ShieldCheck
                          size={17}
                          strokeWidth={1.7}
                        />
                      )}
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-white/62">
                        Privacy protected
                      </p>

                      <p className="mt-1 max-w-[500px] text-[12px] leading-6 text-white/34">
                        SoccaR does not confirm
                        whether an email address
                        is registered through
                        this recovery screen.
                        This helps protect
                        member privacy and
                        account security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center">
          <p
            className="font-semibold uppercase text-white/22"
            style={{
              fontSize: "0.58rem",
              lineHeight: "1.5",
              letterSpacing: "0.3em",
            }}
          >
            SoccaR · The Global Football
            Community Platform
          </p>
        </footer>
      </div>
    </main>
  );
}