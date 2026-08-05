import Communities from "../components/Communities/Communities";
import Hero from "../components/Hero/Hero";
import Navbar from "../components/Navigation/Navbar";
import Problem from "../components/Problem/Problem";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Problem />
      <Communities />
    </main>
  );
}