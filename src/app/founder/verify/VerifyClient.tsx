"use client";

import { useEffect, useState } from "react";
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

  const [state, setState] =
    useState<VerificationState>("verifying");

  const [message, setMessage] = useState(
    "Verifying your Founding Membership…"
  );

  const [founderNumber, setFounderNumber] =
    useState<number | null>(null);

  useEffect(() => {
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
          setFounderNumber(result.founderNumber);
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

        if (result.code === "USED_OR_REVOKED") {
          setState("inactive");
          setMessage(
            result.message ||
              "This verification link is no longer active."
          );
          return;
        }

        if (result.code === "ISSUANCE_PENDING") {
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
    <main className="min-h-screen bg-[#080808] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-10 text-sm font-semibold tracking-[0.35em] text-[#9CE500]">
            SOCCAR
          </div>

          {state === "verifying" && (
            <>
              <div className="mx-auto mb-8 h-3 w-3 animate-pulse rounded-full bg-[#9CE500]" />

              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                Founding Membership
              </p>

              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Verifying your membership…
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/60">
                We&apos;re confirming your email and
                securing your place in the SoccaR
                Founding Community.
              </p>
            </>
          )}

          {state === "success" &&
            founderNumber !== null && (
              <>
                <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-[#9CE500]/30 bg-[#9CE500]/10 text-xl text-[#9CE500]">
                  ✓
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9CE500]">
                  SoccaR Founding Community
                </p>

                <h1 className="mt-5 text-6xl font-semibold tracking-[-0.05em] sm:text-8xl">
                  {formatFounderNumber(
                    founderNumber
                  )}
                </h1>

                <p className="mt-6 text-xl font-medium text-white">
                  You are now a SoccaR Founding
                  Member.
                </p>

                <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/60">
                  You joined SoccaR at the beginning.
                  Your Founder Number is permanent and
                  represents your place in the
                  Founding Community.
                </p>

                <div className="mx-auto mt-10 max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 text-sm">
                    <span className="text-white/45">
                      Place Reserved
                    </span>
                    <span className="text-[#9CE500]">
                      ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 py-4 text-sm">
                    <span className="text-white/45">
                      Email Verified
                    </span>
                    <span className="text-[#9CE500]">
                      ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 text-sm">
                    <span className="text-white/45">
                      Founder Identity
                    </span>
                    <span className="font-medium text-white">
                      Active
                    </span>
                  </div>
                </div>
              </>
            )}

          {state !== "verifying" &&
            state !== "success" && (
              <>
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
              </>
            )}
        </div>
      </section>
    </main>
  );
}