"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Newspaper, Eye, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { GovernorateNewsProps } from "@/types/governorate";
import { governoratesService } from "@/lib/api";
import { timeAgo } from "@/lib/utils/date-format";
import { getNextImageProps } from "@/lib/utils/google-drive-image";
import { truncateHtml } from "@/lib/utils/sanitize-html";

interface NewsItemData {
  _id: string;
  title: string;
  arabicTitle: string;
  slug: string;
  description: string;
  arabicDescription: string;
  coverImage: string;
  published: boolean;
  publishedAt?: string;
  viewCount: number;
  createdAt: string;
}

export function GovernorateNews({ governorateName, governorateId }: GovernorateNewsProps & { governorateId?: string }) {
  const t = useTranslations("governorate.features.comingSoon.news");
  const [news, setNews] = useState<NewsItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!governorateId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await governoratesService.getNews(governorateId, {
          published: true,
          limit: 6,
        });
        setNews(response.data);
      } catch (err) {
        console.error('Failed to fetch governorate news:', err);
        setError('فشل في تحميل الأخبار');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [governorateId]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  // Show coming soon if no governorateId or no news
  if (!governorateId || news.length === 0) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <Newspaper className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {t("title")}
            </h2>
            <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-4">
              {t("subtitle", { governorate: governorateName })}
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <CardContent className="p-12 text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-8 shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  قريباً...
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                  فريقنا يعمل على إعداد محتوى رائع عن أحدث الإنجازات والمبادرات المجتمعية في {governorateName}.
                </p>
                <Button variant="ghost" size="lg" asChild>
                  <Link href="/news">
                    تصفح جميع الأخبار
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Newspaper className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            أخبار {governorateName}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            تابع أحدث الأخبار والفعاليات من محافظة {governorateName}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => {
            const imageProps = getNextImageProps(item.coverImage, '/images/placeholder-news.jpg');
            return (
            <Link href={`/news/${item.slug}`} key={item._id}>
              <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={imageProps.src}
                    alt={item.arabicTitle || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={imageProps.unoptimized}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.arabicTitle || item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {truncateHtml(item.arabicDescription || item.description, 100)}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{timeAgo(item.publishedAt || item.createdAt, 'ar')}</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{item.viewCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/news">
              عرض جميع الأخبار
              <ArrowRight className="w-5 h-5 mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
