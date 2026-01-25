import { Metadata } from "next";
import { newsService } from "@/lib/api";
import { NewsDetailHero } from "../_components/NewsDetailHero";
import { NewsContent } from "../_components/NewsContent";
import { RelatedNews } from "../_components/RelatedNews";
import { SocialShare } from "../_components/SocialShare";
import { notFound } from "next/navigation";
import { processImageUrl } from "@/lib/image-upload";
import { getDriveImageUrl, isDriveUrl } from "@/lib/utils";

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
    const news = await newsService.getBySlug(slug);

    const title = news.arabicTitle || news.title;
    const description = news.arabicDescription || news.description;

    return {
      title: `${title} - YLY Ministry News`,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: [processImageUrl(news.coverImage) || "/images/hero.jpg"],
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
    const response = await newsService.getAll({ published: true, limit: 10 });
    const data = Array.isArray(response?.data) ? response.data : [];
    return data.map((news) => ({
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
    const news = await newsService.getBySlug(slug);

    // Increment view count (fire and forget)
    newsService.incrementView(news._id).catch(() => {});

    // Get display texts (Arabic preferred)
    const title = news.arabicTitle || news.title;
    const description = news.arabicDescription || news.description;
    const content = news.arabicContent || news.content;
    const author = news.arabicAuthor || news.author || 'YLY Team';
    
    // Handle cover image - could be Drive URL or regular URL
    const rawCoverImage = news.coverImage || "/images/hero.jpg";
    const coverImage = isDriveUrl(rawCoverImage) 
      ? getDriveImageUrl(rawCoverImage) 
      : (processImageUrl(rawCoverImage) || "/images/hero.jpg");
    
    const contentImages = news.contentImages?.map(img => {
      if (isDriveUrl(img)) return getDriveImageUrl(img);
      return processImageUrl(img) || img;
    }) || [];

    return (
      <div dir="rtl" className="min-h-screen bg-background">
        {/* Hero Section */}
        <NewsDetailHero
          title={title}
          date={news.publishedAt || news.createdAt}
          author={author}
          image={coverImage}
          governorate={news.governorateId?.arabicName || news.governorateId?.name}
          viewCount={news.viewCount}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* News Content */}
            <div className="lg:col-span-2">
              <NewsContent content={content} images={contentImages} />
              {/* Social Share */}
              <SocialShare
                url={`${process.env.NEXT_PUBLIC_BASE_URL || ""}/news/${slug}`}
                title={title}
                description={description}
              />
            </div>
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <RelatedNews currentNewsId={news._id} />
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
