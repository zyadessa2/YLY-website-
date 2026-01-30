"use client";

import { useState, useEffect } from "react";
import { newsService, NewsItem } from "@/lib/api";
import { getNextImageProps } from "@/lib/utils/google-drive-image";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface RelatedNewsProps {
  currentNewsId: string;
}

// Helper functions
const getTitle = (news: NewsItem): string => news.title || news.arabicTitle || '';
const getDescription = (news: NewsItem): string => news.description || news.arabicDescription || '';

export const RelatedNews = ({ currentNewsId }: RelatedNewsProps) => {
  const [relatedArticles, setRelatedArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedNews = async () => {
      try {
        const response = await newsService.getAll({ published: true, limit: 10 });
        const filtered = response.data
          .filter((news) => news._id !== currentNewsId)
          .slice(0, 3); // Show maximum 3 related articles
        setRelatedArticles(filtered);
      } catch (error) {
        console.error("Error fetching related news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedNews();
  }, [currentNewsId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Related Articles</h3>

      {/* Desktop Layout: Image right, content left, stacked vertically */}
      <div className="hidden lg:block space-y-4">
        {relatedArticles.map((news, index) => {
          const imageProps = getNextImageProps(news.coverImage);
          return (
          <motion.div
            key={news._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/news/${news.slug}`} className="flex">
              {/* Content Left */}
              <div className="flex-1 p-4">
                <h4 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {getTitle(news)}
                </h4>
                <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                  {getDescription(news)}
                </p>
                <div className="text-xs text-muted-foreground">
                  {new Date(news.createdAt).toLocaleDateString("ar-EG")}
                </div>
              </div>

              {/* Image Right */}
              <div className="w-24 h-20 relative flex-shrink-0">
                <Image
                  src={imageProps.src}
                  alt={getTitle(news)}
                  fill
                  className="object-cover"
                  unoptimized={imageProps.unoptimized}
                />
              </div>
            </Link>
          </motion.div>
          );
        })}
      </div>

      {/* Mobile Layout: Grid style */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        {relatedArticles.map((news, index) => {
          const imageProps = getNextImageProps(news.coverImage);
          return (
          <motion.div
            key={news._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/news/${news.slug}`}>
              {/* Image Top */}
              <div className="w-full h-32 relative">
                <Image
                  src={imageProps.src}
                  alt={getTitle(news)}
                  fill
                  className="object-cover"
                  unoptimized={imageProps.unoptimized}
                />
              </div>

              {/* Content Bottom */}
              <div className="p-3">
                <h4 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {getTitle(news)}
                </h4>
                <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                  {getDescription(news)}
                </p>
                <div className="text-xs text-muted-foreground">
                  {new Date(news.createdAt).toLocaleDateString("ar-EG")}
                </div>
              </div>
            </Link>
          </motion.div>
          );
        })}
      </div>
    </div>
  );
};
