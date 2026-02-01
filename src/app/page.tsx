import { Suspense } from "react";
import { SectionTransition } from "../components/ui/SectionTransition";
import About from "./_components/About";
import EgyptMap from "./_components/EgyptMap";
import Hero from "./_components/hero";
import OurVision from "./_components/OurVision";
import Statics from "./_components/Statics";
import LatestNews from "./_components/LatestNews";
// import YlyBoard from "./_components/YlyBoard";
import { FeaturesSection } from "./Governorate/_components/FeaturesSection";

function LatestNewsLoading() {
  return (
    <div className="py-20 px-4 bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-8 w-32 bg-muted animate-pulse rounded-full mx-auto mb-4" />
          <div className="h-12 w-64 bg-muted animate-pulse rounded-lg mx-auto mb-4" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded-lg mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[500px] bg-muted animate-pulse rounded-3xl" />
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
        <Suspense fallback={<LatestNewsLoading />}>
          <LatestNews />
        </Suspense>
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
