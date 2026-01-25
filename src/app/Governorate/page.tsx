import { Metadata } from "next";
import { GovernorateHero } from "./_components/GovernorateHero";
import { EgyptMapSection } from "./_components/EgyptMapSection";
// import { StatsSection } from "./_components/StatsSection";
// import { FeaturesSection } from "./_components/FeaturesSection";
import { GovernorateStructuredData } from "./_components/GovernorateStructuredData";

export const metadata: Metadata = {
  title: "YLY Across Egypt - Youth Leading Youth | All 27 Governorates",
  description:
    "Discover how Youth Leading Youth (YLY) empowers communities across all 27 Egyptian governorates. Join 10,000+ volunteers making a difference through the Ministry of Youth and Sports.",
  keywords: [
    "YLY",
    "Youth Leading Youth",
    "Egypt governorates",
    "youth empowerment",
    "Ministry of Youth and Sports",
    "volunteers",
    "community programs",
  ],
  openGraph: {
    title: "YLY Across Egypt - Youth Leading Youth",
    description:
      "Join 10,000+ YLY volunteers empowering youth across all 27 Egyptian governorates through leadership, training, and community service.",
    images: ["/images/hero.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YLY Across Egypt - Youth Leading Youth",
    description:
      "Join 10,000+ YLY volunteers empowering youth across all 27 Egyptian governorates.",
    images: ["/images/hero.jpg"],
  },
  alternates: {
    canonical: "/governorate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const page = () => {
  return (
    <>
      <GovernorateStructuredData />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <GovernorateHero />

        {/* Stats Section */}
        {/* <StatsSection /> */}

        {/* Egypt Map Section */}
        <section id="map-section">
          <EgyptMapSection />
        </section>

        {/* Features Section */}
        {/* <FeaturesSection /> */}
      </main>
    </>
  );
};

export default page;
