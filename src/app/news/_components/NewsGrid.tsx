"use client";

import { motion } from "framer-motion";
import { NewsCard } from "./NewsCard";
import TitleMotion from "@/components/my-components/TitleMotion";
import { useState, useEffect } from "react";
import { NewsService, NewsItem } from "@/lib/database";
import { Loader2 } from "lucide-react";

export const NewsGrid = () => {
  const [showAll, setShowAll] = useState(false);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialDisplayCount = 6;
  const displayedNews = showAll
    ? newsData
    : newsData.slice(0, initialDisplayCount);
  const hasMoreNews = newsData.length > initialDisplayCount;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await NewsService.getAllNews();
        setNewsData(data);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news articles");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
        <TitleMotion title="Stay with us moment by moment" className="mb-12" />
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
        <TitleMotion title="Stay with us moment by moment" className="mb-12" />
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
      {" "}
      <TitleMotion title="Latest News" className="mb-12" />
      {/* News Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {displayedNews.map((news, index) => (
          <NewsCard
            key={news.slug}
            {...news}
            index={showAll ? index : index % initialDisplayCount}
          />
        ))}
      </motion.div>
      {/* Empty state */}
      {newsData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-lg text-muted-foreground">
            No news articles available at the moment.
          </p>
        </motion.div>
      )}
      {/* Load More Button */}
      {hasMoreNews && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-primary to-purple-600 px-8 py-3 text-white transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 font-medium">
              {showAll ? "Show Less" : "Load More News"}
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </button>
        </motion.div>
      )}
    </section>
  );
};
