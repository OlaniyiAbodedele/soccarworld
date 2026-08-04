import Hero from "../components/Hero/Hero";
import Navbar from "../components/Navigation/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
    </main>
  );
}