"use client";

export const GovernorateStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "YLY Across Egypt - Youth Leading Youth in All Governorates",
    description:
      "Discover how Youth Leading Youth (YLY) empowers communities across all 27 Egyptian governorates through the Ministry of Youth and Sports.",
    url: typeof window !== "undefined" ? window.location.href : "",
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Youth Leading Youth (YLY)",
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://yly-ministry.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Youth Leading Youth (YLY) - Ministry of Youth and Sports",
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://yly-ministry.com",
    },
    about: {
      "@type": "Organization",
      name: "Youth Leading Youth (YLY)",
      description:
        "Youth empowerment program operating across all 27 Egyptian governorates",
      foundingDate: "2018",
      founder: {
        "@type": "Person",
        name: "Dr. Ashraf Sobhi",
        jobTitle: "Minister of Youth and Sports",
      },
      memberOf: {
        "@type": "Organization",
        name: "Ministry of Youth and Sports - Egypt",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      name: "YLY Programs Across Egyptian Governorates",
      numberOfItems: 27,
      itemListElement: [
        {
          "@type": "Place",
          name: "Cairo",
          description:
            "YLY's central hub empowering youth through leadership programs",
        },
        {
          "@type": "Place",
          name: "Giza",
          description:
            "YLY volunteers organizing events and youth programs near the Great Pyramids",
        },
        {
          "@type": "Place",
          name: "Alexandria",
          description: "Egypt's second-largest city and main port",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
