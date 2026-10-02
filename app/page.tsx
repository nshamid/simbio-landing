import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatBand from "@/components/StatBand";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import RoleCTA from "@/components/RoleCTA";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Reveal>
        <StatBand />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <Features />
      </Reveal>
      <Reveal>
        <RoleCTA />
      </Reveal>
      <Reveal>
        <FinalCTA />
      </Reveal>
      <Footer />
    </main>
  );
}
