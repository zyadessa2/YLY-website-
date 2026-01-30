"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, TrendingUp } from "lucide-react";
import { NewsItem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { getNextImageProps } from "@/lib/utils/google-drive-image";

// =====================================================
// Types
// =====================================================

interface LatestNewsClientProps {
  featuredNews: NewsItem;
  regularNews: NewsItem[];
}

// =====================================================
// Helper Functions
// =====================================================

/** Format date to Arabic locale */
function formatDate(date: string, format: "long" | "short" = "long") {
  return new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: format,
    day: "numeric",
  });
}

// =====================================================
// Sub Components
// =====================================================

function BackgroundDecoration() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
    </div>
  );
}

function SectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm font-medium">آخر الأخبار</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground leading-tight">
        اكتشف آخر الأخبار
      </h2>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        تابع آخر الأحداث والفعاليات والإنجازات من مختلف المحافظات
      </p>
    </motion.div>
  );
}

function FeaturedNewsCard({ news }: { news: NewsItem }) {
  const imageProps = getNextImageProps(news.coverImage);

  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="lg:row-span-2 group relative overflow-hidden rounded-3xl bg-card shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <Link href={`/news/${news.slug}`} className="block h-full">
        <div className="relative h-full min-h-[500px] lg:min-h-[600px]">
          <div className="absolute inset-0">
            <Image
              src={imageProps.src}
              alt={news.title || news.arabicTitle || "Featured News"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized={imageProps.unoptimized}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/90 text-white text-sm font-medium mb-4">
              <span>مميز</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors">
              {news.title || news.arabicTitle}
            </h3>
            <p className="text-white/90 text-lg mb-4 line-clamp-2">
              {news.description || news.arabicDescription}
            </p>
            <div className="flex items-center gap-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formatDate(news.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function RegularNewsCard({ news, index }: { news: NewsItem; index: number }) {
  const imageProps = getNextImageProps(news.coverImage);

  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-card shadow-md hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/news/${news.slug}`} className="block">
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
            <Image
              src={imageProps.src}
              alt={news.title || news.arabicTitle || "News"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="128px"
              unoptimized={imageProps.unoptimized}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {news.title || news.arabicTitle}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {news.description || news.arabicDescription}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(news.createdAt, "short")}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function ViewAllButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="text-center"
    >
      <Link href="/news">
        <Button
          size="lg"
          className="group relative overflow-hidden rounded-full px-8 py-6 text-lg font-semibold"
        >
          <span className="relative z-10 flex items-center gap-2">
            عرض جميع الأخبار
            <ArrowRight className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-transform group-hover:scale-105" />
        </Button>
      </Link>
    </motion.div>
  );
}

// =====================================================
// Main Component
// =====================================================

export function LatestNewsClient({ featuredNews, regularNews }: LatestNewsClientProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
      <BackgroundDecoration />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FeaturedNewsCard news={featuredNews} />

          <div className="grid grid-cols-1 gap-6">
            {regularNews.map((item, index) => (
              <RegularNewsCard key={item._id} news={item} index={index} />
            ))}
          </div>
        </div>

        <ViewAllButton />
      </div>
    </section>
  );
}

export default LatestNewsClient;
