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
    newsData = response?.data || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    // Return empty state instead of null to avoid hydration issues
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-background via-muted/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">لا يمكن تحميل الأخبار حالياً</p>
        </div>
      </section>
    );
  }

  if (!newsData || newsData.length === 0) {
    return null;
  }

  const featuredNews = newsData[0];
  const regularNews = newsData.slice(1, 6);

  return <LatestNewsClient featuredNews={featuredNews} regularNews={regularNews} />;
}
