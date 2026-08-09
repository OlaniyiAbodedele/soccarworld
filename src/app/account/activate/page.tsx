import { Suspense } from "react";
import ActivateClient from "./ActivateClient";

function ActivationLoading() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl text-center">
          <div className="text-sm font-semibold tracking-[0.35em] text-[#9CE500]">
            SOCCAR
          </div>

          <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/40">
            Founding Community
          </div>

          <div className="mx-auto mt-10 h-3 w-3 animate-pulse rounded-full bg-[#9CE500]" />

          <p className="mt-6 text-sm text-white/50">
            Preparing your secure account activation…
          </p>
        </div>
      </section>
    </main>
  );
}

export default function AccountActivationPage() {
  return (
    <Suspense fallback={<ActivationLoading />}>
      <ActivateClient />
    </Suspense>
  );
}