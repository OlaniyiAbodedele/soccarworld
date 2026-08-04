import Container from "../Common/Container";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-black pt-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_76%_38%,rgba(156,229,0,0.14),transparent_28%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#9CE500]/[0.04] to-transparent"
      />

      <Container className="relative z-10">
        <div className="grid min-h-[calc(100vh-5rem)] items-center gap-12 py-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.32em] text-[#9CE500] sm:text-sm">
              The Global Football Community Platform
            </p>

            <h1 className="text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
              One global home for everyone shaping football.
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              SoccaR connects fans, players, clubs and the people building the
              future of the game in one intelligent global ecosystem.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#founding-community"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#9CE500] px-7 py-3 text-sm font-semibold tracking-[0.08em] text-black transition duration-300 hover:bg-[#B2FF1A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9CE500]"
              >
                Join the Founding Community
              </a>

              <a
                href="#vision-film"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-3 text-sm font-semibold tracking-[0.08em] text-white transition duration-300 hover:border-[#9CE500]/50 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Watch Teaser
              </a>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative hidden min-h-[620px] lg:block"
          >
            <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_center,rgba(156,229,0,0.10),transparent_58%)]" />

            <div className="absolute inset-x-10 bottom-16 h-px bg-gradient-to-r from-transparent via-[#9CE500]/50 to-transparent" />

            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9CE500]/10 shadow-[0_0_120px_rgba(156,229,0,0.08)]" />
          </div>
        </div>
      </Container>
    </section>
  );
}