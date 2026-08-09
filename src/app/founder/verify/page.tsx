import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

function VerificationLoading() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-10 text-sm font-semibold tracking-[0.35em] text-[#9CE500]">
            SOCCAR
          </div>

          <div className="mx-auto mb-8 h-3 w-3 animate-pulse rounded-full bg-[#9CE500]" />

          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
            Founding Membership
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Verifying your membership…
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/60">
            We&apos;re confirming your email and securing your place in the
            SoccaR Founding Community.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function FounderVerificationPage() {
  return (
    <Suspense fallback={<VerificationLoading />}>
      <VerifyClient />
    </Suspense>
  );
}