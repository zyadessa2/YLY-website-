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
  const initialDisplayCount = 6;
  const displayedNews = showAll
    ? initialData
    : initialData.slice(0, initialDisplayCount);
  const hasMoreNews = initialData.length > initialDisplayCount;

  return (
    <>
      <motion.div
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        layout
      >
        {displayedNews.map((news, index) => (
          <NewsCard
            key={news.slug}
            news={news}
            index={showAll ? index : index % initialDisplayCount}
          />
        ))}
      </motion.div>

      {/* Empty state */}
      {initialData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-[400px] items-center justify-center"
        >
          <p className="text-lg text-muted-foreground">No news articles yet.</p>
        </motion.div>
      )}

      {/* Read More Button */}
      {hasMoreNews && (
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="group relative overflow-hidden rounded-full bg-primary px-8 py-3 text-white transition-all hover:shadow-lg"
          >
            <span className="relative z-10 text-lg font-medium">
              {showAll ? "Show Less" : "Read More"}
            </span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ type: "tween" }}
              style={{ mixBlendMode: "overlay" }}
            />
            <motion.div
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)",
                mixBlendMode: "overlay",
              }}
              animate={{
                scale: [1, 1.5],
                opacity: [0.5, 0],
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
    </>
  );
};
