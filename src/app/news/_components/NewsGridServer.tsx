import { newsService, NewsItem } from "@/lib/api";
import TitleMotion from "@/components/my-components/TitleMotion";
import { NewsGridClient } from "./NewsGridClient";

export async function NewsGridServer() {
  let newsData: NewsItem[] = [];
  
  try {
    const response = await newsService.getAll({ published: true, limit: 50 });
    newsData = response.data || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    // Continue with empty data - will show "no news" message
  }

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
      <TitleMotion title="Stay with us moment by moment" className="mb-12" />
      {newsData.length > 0 ? (
        <NewsGridClient initialData={newsData} />
      ) : (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-2">
              No news articles available at the moment.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Please check back later or ensure the backend server is running.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
