import { Metadata } from "next";
import { getNewsById, newsData } from "../_data/news";
import { NewsDetailHero } from "../_components/NewsDetailHero";
import { NewsContent } from "../_components/NewsContent";
import { RelatedNews } from "../_components/RelatedNews";
import { Comments } from "../_components/Comments";
import { SocialShare } from "../_components/SocialShare";
import { notFound } from "next/navigation";

interface NewsPageProps {
  params: {
    slug: string;
  };
}

// Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const news = getNewsById(params.slug);

  if (!news) {
    return {
      title: "News Not Found - YLY Ministry",
    };
  }

  return {
    title: `${news.title} - YLY Ministry News`,
    description: news.description,
    openGraph: {
      title: news.title,
      description: news.description,
      images: [news.image],
    },
  };
}

export default function NewsDetailPage({ params }: NewsPageProps) {
  const news = getNewsById(params.slug);

  if (!news) {
    notFound();
  }
  return (
    <main className="min-h-screen">
      <NewsDetailHero
        title={news.title}
        date={news.date}
        author={news.author}
        image={news.image}
      />
      <NewsContent content={news.content} images={news.images} />
      <RelatedNews currentNewsId={news.slug} allNews={newsData} />
      <Comments newsId={news.slug} />
      <SocialShare
        url={`${
          process.env.NEXT_PUBLIC_BASE_URL || "https://yly-website.vercel.app"
        }/news/${news.slug}`}
        title={news.title}
        description={news.description}
      />
    </main>
  );
}
