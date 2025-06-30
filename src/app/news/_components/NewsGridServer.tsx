import { NewsService } from "@/lib/database";
import TitleMotion from "@/components/my-components/TitleMotion";
import { NewsGridClient } from "./NewsGridClient";

export async function NewsGridServer() {
  try {
    const newsData = await NewsService.getAllNews();

    return (
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
        <TitleMotion title="Stay with us moment by moment" className="mb-12" />
        <NewsGridClient initialData={newsData} />
      </section>
    );
  } catch (error) {
    console.error("Error fetching news:", error);

    return (
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
        <TitleMotion title="Stay with us moment by moment" className="mb-12" />
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-lg text-red-500">
            Unable to load news articles at this time. Please try again later.
          </p>
        </div>
      </section>
    );
  }
}
