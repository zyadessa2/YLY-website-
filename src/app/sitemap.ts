import { MetadataRoute } from "next";
import { NewsService, EventsService } from "@/lib/database";

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
    const allNews = await NewsService.getAllNews();
    const newsRoutes: MetadataRoute.Sitemap = allNews.map((news) => ({
      url: `${baseUrl}/news/${news.slug}`,
      lastModified: new Date(news.updated_at || news.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Dynamic events routes
    const allEvents = await EventsService.getAllEvents();
    const eventsRoutes: MetadataRoute.Sitemap = allEvents.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: new Date(event.updated_at || event.created_at),
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
