"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

import { NewsItem } from "@/lib/database";

interface NewsCardProps
  extends Omit<
    NewsItem,
    | "content"
    | "published"
    | "featured"
    | "view_count"
    | "created_by"
    | "updated_by"
  > {
  index: number;
}

export const NewsCard = ({
  title,
  description,
  cover_image,
  created_at,
  author,
  slug,
  index,
}: NewsCardProps) => {
  // Format date for display
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      className="group relative overflow-hidden rounded-xl bg-card"
    >
      <Link href={`/news/${slug}`}>
        <div className="aspect-[16/9] overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            {" "}
            <Image
              src={cover_image || "/images/hero.jpg"}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        </div>

        <div className="p-6">
          <h3 className="mb-3 text-2xl font-semibold text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="mb-4 line-clamp-2 text-muted-foreground">
            {description}
          </p>{" "}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
