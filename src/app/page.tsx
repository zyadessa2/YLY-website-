import { SectionTransition } from "../components/ui/SectionTransition";
import About from "./_components/About";
import EgyptMap from "./_components/EgyptMap";
import Hero from "./_components/hero";
import OurVision from "./_components/OurVision";
import Statics from "./_components/Statics";
import LatestNews from "./_components/LatestNews";
// import YlyBoard from "./_components/YlyBoard";
import { FeaturesSection } from "./Governorate/_components/FeaturesSection";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <SectionTransition>
        <About />
      </SectionTransition>
      <SectionTransition>
        <OurVision />
      </SectionTransition>
      <SectionTransition>
        <Statics />
      </SectionTransition>
      <SectionTransition>
        <LatestNews />
      </SectionTransition>
      {/* <SectionTransition>
        <YlyBoard />
      </SectionTransition> */}
      <SectionTransition>
        <EgyptMap />
      </SectionTransition>
      <SectionTransition>
        <FeaturesSection />
      </SectionTransition>
    </main>
  );
}
