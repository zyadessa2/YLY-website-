import { newsService, NewsItem } from "@/lib/api";
import { LatestNewsClient } from "./LatestNewsClient";

export default async function LatestNews() {
  let newsData: NewsItem[] = [];

  try {
    const response = await newsService.getAll({ 
      published: true, 
      limit: 6,
      sortBy: "createdAt",
      sortOrder: "desc"
    });
    newsData = response.data || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }

  if (newsData.length === 0) {
    return null;
  }

  const featuredNews = newsData[0];
  const regularNews = newsData.slice(1, 6);

  return <LatestNewsClient featuredNews={featuredNews} regularNews={regularNews} />;
}
