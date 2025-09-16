import { Metadata } from "next";
import { notFound } from "next/navigation";
import governoratesData from "@/data/governorates-data.json";
import { GovernoratePageProps } from "@/types/governorate";
import { 
  GovernorateHero,
  GovernorateMembers,
  GovernorateNews,
  GovernorateEvents,
  GovernorateStats
} from "./_components";

export async function generateMetadata({ params }: GovernoratePageProps): Promise<Metadata> {
  try {
    // Await params to satisfy Next.js requirements
    const resolvedParams = await params;

    // Get governorate data from JSON file
    const governorateData =
      governoratesData[resolvedParams.slug as keyof typeof governoratesData];

    if (!governorateData) {
      return {
        title: "Governorate Not Found | YLY",
        description: "The requested governorate page could not be found.",
      };
    }

    return {
      title: `${governorateData.name} | YLY - Youth Leading Youth`,
      description:
        governorateData.description ||
        `Discover YLY activities and programs in ${governorateData.name} governorate`,
      keywords: [
        `YLY ${governorateData.name}`,
        "Youth Leading Youth",
        governorateData.name,
        "Egypt governorates",
        "youth programs",
      ],
      openGraph: {
        title: `YLY in ${governorateData.name}`,
        description:
          governorateData.description ||
          `YLY programs and activities in ${governorateData.name}`,
        images: governorateData.cover_image
          ? [governorateData.cover_image]
          : ["/images/hero.jpg"],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `YLY in ${governorateData.name}`,
        description:
          governorateData.description ||
          `YLY programs and activities in ${governorateData.name}`,
        images: governorateData.cover_image
          ? [governorateData.cover_image]
          : ["/images/hero.jpg"],
      },
      alternates: {
        canonical: `/governorate/${resolvedParams.slug}`,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      title: "Governorate Not Found | YLY",
      description: "The requested governorate page could not be found.",
    };
  }
}

export async function generateStaticParams() {
  try {
    // Use JSON data for static params generation
    const slugs = Object.keys(governoratesData);
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function GovernoratePage({ params }: GovernoratePageProps) {
  try {
    // Await params to satisfy Next.js requirements
    const resolvedParams = await params;

    // Get governorate data from JSON file
    const governorateData =
      governoratesData[resolvedParams.slug as keyof typeof governoratesData];

    if (!governorateData) {
      notFound();
    }

    // Get members from the governorate data
    const sampleMembers = governorateData.members || [];

    // Generate JSON-LD structured data for SEO
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: `YLY ${governorateData.name}`,
      description:
        governorateData.description ||
        `Youth Leading Youth activities in ${governorateData.name} governorate`,
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://yly.org"
      }/Governorate/${resolvedParams.slug}`,
      logo: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://yly.org"
      }/logo.webp`,
      address: {
        "@type": "PostalAddress",
        addressLocality: governorateData.capital,
        addressCountry: "Egypt",
      },
      sameAs: [
        "https://facebook.com/yly.egypt",
        "https://instagram.com/yly.egypt",
      ],
      member: sampleMembers.map((member) => ({
        "@type": "Person",
        name: member.name,
        jobTitle: member.position,
        email: member.email,
        image: `${process.env.NEXT_PUBLIC_BASE_URL || "https://yly.org"}${
          member.profile_image
        }`,
      })),
    };

    return (
      <main className="min-h-screen bg-background">
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero Section */}
        <GovernorateHero governorate={governorateData} />

        <GovernorateStats
          governorate={governorateData}
          newsCount={0}
          eventsCount={0}
        />

        {sampleMembers.length > 0 && (
          <GovernorateMembers
            members={sampleMembers}
            governorateName={governorateData.name}
          />
        )}

        <GovernorateNews governorateName={governorateData.name} />

        <GovernorateEvents governorateName={governorateData.name} />
      </main>
    );
  } catch (error) {
    console.error("Error loading governorate:", error);
    notFound();
  }
}
