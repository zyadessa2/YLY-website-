import { Metadata } from "next";
import { NewsService } from "@/lib/database";
import { NewsDetailHero } from "../_components/NewsDetailHero";
import { NewsContent } from "../_components/NewsContent";
import { RelatedNews } from "../_components/RelatedNews";
import { Comments } from "../_components/Comments";
import { SocialShare } from "../_components/SocialShare";
import { notFound } from "next/navigation";

interface NewsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const news = await NewsService.getNewsBySlug(slug);

    return {
      title: `${news.title} - YLY Ministry News`,
      description: news.description,
      openGraph: {
        title: news.title,
        description: news.description,
        images: [news.cover_image || "/images/hero.jpg"],
      },
    };
  } catch (error) {
    console.error("Error fetching news for metadata:", error);
    return {
      title: "News Not Found - YLY Ministry",
      description: "The requested news article could not be found.",
    };
  }
}

// Generate static params for better performance (ISR)
export async function generateStaticParams() {
  try {
    const allNews = await NewsService.getAllNews();
    return allNews.slice(0, 10).map((news) => ({
      slug: news.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  try {
    const { slug } = await params;
    const news = await NewsService.getNewsBySlug(slug);

    // Increment view count
    try {
      await NewsService.incrementViewCount(news.id);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }

    return (
      <div dir="rtl" className="min-h-screen bg-background">
        {/* Hero Section */}
        <NewsDetailHero
          title={news.title}
          date={news.created_at}
          author={news.author}
          image={news.cover_image || "/images/hero.jpg"}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* News Content */}
            <div className="lg:col-span-2">
              <NewsContent content={news.content} images={news.content_images} /> {/* Social Share */}
              <SocialShare
                url={`${process.env.NEXT_PUBLIC_BASE_URL || ""}/news/${slug}`}
                title={news.title}
                description={news.description}
              />
              {/* Comments */}
              <Comments newsId={news.id} />
            </div>{" "}
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <RelatedNews currentNewsId={news.id} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    notFound();
  }
}
