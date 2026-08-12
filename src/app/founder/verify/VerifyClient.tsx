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
  return `#${String(value).padStart(6, "0")}`;
}

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verificationStartedRef =
    useRef(false);

  const [state, setState] =
    useState<VerificationState>("verifying");

  const [message, setMessage] = useState(
    "Verifying your Founding Membership…"
  );

  const [founderNumber, setFounderNumber] =
    useState<number | null>(null);

  useEffect(() => {
    if (verificationStartedRef.current) {
      return;
    }

    verificationStartedRef.current = true;

    async function verifyFounder() {
      if (!token) {
        setState("invalid");
        setMessage(
          "We could not verify this link. Please request a new verification email."
        );
        return;
      }

      try {
        const response = await fetch(
          "/api/founder/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
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

        if (result.code === "EXPIRED") {
          setState("expired");
          setMessage(
            result.message ||
              "This verification link has expired. Your reservation is still secure."
          );
          return;
        }

        if (
          result.code === "USED_OR_REVOKED"
        ) {
          setState("inactive");
          setMessage(
            result.message ||
              "This verification link is no longer active."
          );
          return;
        }

        if (
          result.code === "ISSUANCE_PENDING"
        ) {
          setState("issuance-pending");
          setMessage(
            result.message ||
              "Your email has been verified, but Founder activation is still being completed."
          );
          return;
        }

        if (result.code === "INVALID") {
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
  }, [token]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070707] text-white">
      <section className="relative mx-auto flex min-h-screen w-full items-center justify-center px-5 py-16 sm:px-8 lg:px-12">
        <div
          className="pointer-events-none absolute left-1/2 top-[-220px] h-[520px] w-[760px] -translate-x-1/2 rounded-full opacity-20 blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(156,229,0,0.48) 0%, rgba(156,229,0,0) 68%)",
          }}
        />

        <div className="relative z-10 w-full max-w-4xl">
          <div className="mb-12 text-center">
            <div className="text-sm font-extrabold tracking-[0.42em] text-[#9CE500]">
              SOCCAR
            </div>

            <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/35">
              Founding Community
            </div>
          </div>

          {state === "verifying" && (
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-8 h-3 w-3 animate-pulse rounded-full bg-[#9CE500]" />

              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                Founding Membership
              </p>

              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Verifying your membership…
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/60">
                We&apos;re confirming your email
                and securing your place in the
                SoccaR Founding Community.
              </p>
            </div>
          )}

          {state === "success" &&
            founderNumber !== null && (
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#101010] shadow-2xl shadow-black/40">
                <div className="h-1 w-full bg-[#9CE500]" />

                <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#9CE500]/30 bg-[#9CE500]/10 text-2xl font-semibold text-[#9CE500]">
                      ✓
                    </div>

                    <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.28em] text-[#9CE500]">
                      Membership Activated
                    </p>

                    <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                      Welcome to the
                      <br className="hidden sm:block" />
                      {" "}
                      Founding Community.
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
                      Your email has been verified
                      and your SoccaR Founding
                      Membership is now active.
                    </p>
                  </div>

                  <div className="mx-auto mt-10 max-w-2xl rounded-[24px] border border-white/10 bg-[#090909] px-6 py-8 text-center sm:px-8">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-white/35">
                      Your Permanent Founder Number
                    </p>

                    <div className="mt-4 text-6xl font-semibold tracking-[-0.05em] text-white sm:text-7xl lg:text-8xl">
                      {formatFounderNumber(
                        founderNumber
                      )}
                    </div>

                    <p className="mt-5 text-sm font-semibold text-[#9CE500] sm:text-base">
                      You were here at the beginning.
                    </p>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/45 sm:text-base sm:leading-7">
                      Your Founder Number is secured
                      and permanent. It represents
                      your place in the community
                      that joined SoccaR at its
                      foundation.
                    </p>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-center">
                      <div className="text-xl text-[#9CE500]">
                        ✓
                      </div>

                      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                        Place Reserved
                      </div>

                      <div className="mt-2 text-sm font-medium text-white">
                        Complete
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-center">
                      <div className="text-xl text-[#9CE500]">
                        ✓
                      </div>

                      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                        Email Verified
                      </div>

                      <div className="mt-2 text-sm font-medium text-white">
                        Complete
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-center">
                      <div className="text-xl text-[#9CE500]">
                        ✓
                      </div>

                      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                        Founder Identity
                      </div>

                      <div className="mt-2 text-sm font-medium text-white">
                        Active
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-[24px] border border-[#9CE500]/20 bg-[#9CE500]/[0.055] px-6 py-7 sm:px-8 sm:py-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#9CE500]/25 bg-[#9CE500]/10 text-[#9CE500]">
                        →
                      </div>

                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-[#9CE500]">
                          One Final Step
                        </p>

                        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                          Activate your SoccaR
                          account.
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                          Your Founding Membership
                          is already active. We&apos;ve
                          sent a welcome message to
                          your email with your next
                          step.
                        </p>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                          Follow the secure link in
                          that email to activate your
                          SoccaR account and create
                          your sign-in details.
                        </p>

                        <p className="mt-5 text-sm font-semibold text-white">
                          Your Founder Number is
                          already secured and will
                          not change.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <p className="text-sm leading-6 text-white/35">
                      Check your inbox for your
                      SoccaR welcome message.
                    </p>

                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/25">
                      Welcome to the beginning.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {state !== "verifying" &&
            state !== "success" && (
              <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-lg text-white/70">
                  !
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                  Founding Membership
                </p>

                <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                  {state === "expired"
                    ? "Verification link expired"
                    : state === "inactive"
                    ? "Verification already used"
                    : state ===
                      "issuance-pending"
                    ? "Email verified"
                    : "We couldn’t verify this link"}
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/60">
                  {message}
                </p>
              </div>
            )}
        </div>
      </section>
    </main>
  );
}