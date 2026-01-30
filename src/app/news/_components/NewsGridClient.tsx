"use client";

import { motion } from "framer-motion";
import { NewsCard } from "./NewsCard";
import { useState } from "react";
import { NewsItem } from "@/lib/api";

interface NewsGridClientProps {
  initialData: NewsItem[];
}

export const NewsGridClient = ({ initialData }: NewsGridClientProps) => {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 9;
  const displayedNews = showAll
    ? initialData
    : initialData.slice(0, initialDisplayCount);
  const hasMoreNews = initialData.length > initialDisplayCount;

  // Split news for featured layout
  const featuredNews = displayedNews[0];
  const secondaryNews = displayedNews.slice(1, 3);
  const regularNews = displayedNews.slice(3);

  return (
    <>
      {initialData.length > 0 && (
        <div className="space-y-8">
          {/* Featured + Secondary Grid (Magazine Style) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Article - Large */}
            {featuredNews && (
              <div className="lg:col-span-2">
                <NewsCard
                  news={featuredNews}
                  index={0}
                  variant="featured"
                />
              </div>
            )}
            
            {/* Secondary Articles - Stacked */}
            <div className="space-y-6">
              {secondaryNews.map((news, index) => (
                <NewsCard
                  key={news.slug}
                  news={news}
                  index={index + 1}
                  variant="secondary"
                />
              ))}
            </div>
          </div>

          {/* Regular Grid */}
          {regularNews.length > 0 && (
            <motion.div
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              layout
            >
              {regularNews.map((news, index) => (
                <NewsCard
                  key={news.slug}
                  news={news}
                  index={index + 3}
                  variant="regular"
                />
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Empty state */}
      {initialData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-[400px] items-center justify-center"
        >
          <p className="text-lg text-muted-foreground">لا توجد أخبار حالياً</p>
        </motion.div>
      )}

      {/* Load More Button */}
      {hasMoreNews && (
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 px-10 py-4 text-white font-semibold transition-all hover:shadow-2xl hover:scale-105"
          >
            <span className="relative z-10 text-lg">
              {showAll ? "عرض أقل" : "عرض المزيد"}
            </span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
              style={{ mixBlendMode: "overlay", opacity: 0.2 }}
            />
          </button>
        </motion.div>
      )}
    </>
  );
};
