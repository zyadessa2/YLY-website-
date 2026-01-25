"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { processImageUrl } from "@/lib/image-upload";
import { getDriveImageUrl, isDriveUrl } from "@/lib/utils";

import { NewsItem } from "@/lib/api";

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

export const NewsCard = ({ news, index }: NewsCardProps) => {
  // Get title - API returns separate fields (title, arabicTitle)
  const title = news.title || news.arabicTitle || '';
  const description = news.description || news.arabicDescription || '';
  
  // Handle cover image - could be Drive URL or regular URL
  const rawImage = news.coverImage || "/images/hero.jpg";
  const isGoogleDriveImage = isDriveUrl(rawImage);
  const coverImage = isGoogleDriveImage 
    ? getDriveImageUrl(rawImage) 
    : (processImageUrl(rawImage) || "/images/hero.jpg");
  
  const createdAt = news.createdAt;
  const author = news.author || 'YLY Team';
  const slug = news.slug;

  // Format date for display
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
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
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={isGoogleDriveImage}
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
