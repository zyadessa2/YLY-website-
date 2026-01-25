import { MetadataRoute } from "next";
import { newsService, eventsService } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://ylyministry.vercel.app/";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
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
      url: `${baseUrl}/contactUs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    // Dynamic news routes
    const newsResponse = await newsService.getAll({ published: true, limit: 100 });
    const newsData = Array.isArray(newsResponse?.data) ? newsResponse.data : [];
    const newsRoutes: MetadataRoute.Sitemap = newsData.map((news) => ({
      url: `${baseUrl}/news/${news.slug}`,
      lastModified: new Date(news.updatedAt || news.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Dynamic events routes
    const eventsResponse = await eventsService.getAll({ published: true, limit: 100 });
    const eventsData = Array.isArray(eventsResponse?.data) ? eventsResponse.data : [];
    const eventsRoutes: MetadataRoute.Sitemap = eventsData.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: new Date(event.updatedAt || event.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...newsRoutes, ...eventsRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static routes if dynamic routes fail
    return staticRoutes;
  }
}
