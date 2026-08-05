import Communities from "../components/Communities/Communities";
import Ecosystem from "../components/Ecosystem/Ecosystem";
import PlatformFeatures from "../components/Ecosystem/PlatformFeatures";
import Footer from "../components/Footer/Footer";
import FoundingCommunity from "../components/FoundingCommunity/FoundingCommunity";
import Hero from "../components/Hero/Hero";
import Navbar from "../components/Navigation/Navbar";
import Problem from "../components/Problem/Problem";
import WhySoccaR from "../components/why-soccar/why-soccar";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Problem />
      <Communities />
      <WhySoccaR />
      <Ecosystem />
      <PlatformFeatures />
      <FoundingCommunity />
      <Footer />
    </main>
  );
}