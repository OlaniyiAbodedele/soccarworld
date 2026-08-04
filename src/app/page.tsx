import Navbar from "../components/Navigation/Navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <Navbar />

      <div className="max-w-4xl text-center">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-[#9CE500]">
          SoccaR Engineering
        </p>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
          The journey to soccarworld.com has begun.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
          We are building the world&apos;s connected football ecosystem,
          one disciplined step at a time.
        </p>
      </div>
    </main>
  );
}