import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://yly-ministry.com";

  // Egyptian governorates for dynamic sitemap generation
  const governorates = [
    "cairo",
    "giza",
    "alexandria",
    "qalyubia",
    "sharqia",
    "dakahlia",
    "beheira",
    "minya",
    "gharbia",
    "sohag",
    "assiut",
    "beni-suef",
    "kafr-el-sheikh",
    "faiyum",
    "menofia",
    "suez",
    "ismailia",
    "port-said",
    "damietta",
    "north-sinai",
    "south-sinai",
    "red-sea",
    "luxor",
    "qena",
    "aswan",
    "new-valley",
    "matrouh",
  ];

  const governorateUrls = governorates.map((governorate) => ({
    url: `${baseUrl}/governorate/${governorate}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/governorate`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...governorateUrls,
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
