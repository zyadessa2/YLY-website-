"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { getNextImageProps } from "@/lib/utils/google-drive-image";
import { NewsItem } from "@/lib/api";

interface NewsCardProps {
  news: NewsItem;
  index: number;
  variant?: "featured" | "secondary" | "regular";
}

export const NewsCard = ({ news, index, variant = "regular" }: NewsCardProps) => {
  // Get title and description
  const title = news.title || news.arabicTitle || '';
  const description = news.description || news.arabicDescription || '';
  
  // Get image props using the new utility function
  const imageProps = getNextImageProps(news.coverImage);
  
  const author = news.author || 'YLY Team';

  // Format date for display
  const formattedDate = new Date(news.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Featured Article (Large with overlay text)
  if (variant === "featured") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group relative overflow-hidden rounded-2xl h-[600px]"
      >
        <Link href={`/news/${news.slug}`}>
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={imageProps.src}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 66vw"
              unoptimized={imageProps.unoptimized}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-full bg-primary/90 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
                خبر مميز
              </span>
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{formattedDate}</span>
              </div>
            </div>
            
            <h2 className="mb-4 text-4xl font-bold text-white leading-tight line-clamp-3 drop-shadow-lg">
              {title}
            </h2>
            
            <p className="mb-6 text-lg text-white/90 line-clamp-2 drop-shadow">
              {description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/80">
                <User className="h-4 w-4" />
                <span className="text-sm">{author}</span>
              </div>
              <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
                <span className="text-sm font-medium">اقرأ المزيد</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // Secondary Article (Medium horizontal)
  if (variant === "secondary") {
    return (
      <motion.article
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
      >
        <Link href={`/news/${news.slug}`} className="flex flex-col h-full">
          <div className="aspect-[16/10] overflow-hidden">
            <Image
              src={imageProps.src}
              alt={title}
              width={400}
              height={250}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              unoptimized={imageProps.unoptimized}
            />
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3 className="mb-2 text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {title}
            </h3>
            
            <p className="mb-3 text-sm text-muted-foreground line-clamp-2 flex-1">
              {description}
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // Regular Article (Standard card)
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-xl hover:border-primary/50 transition-all duration-300"
    >
      <Link href={`/news/${news.slug}`}>
        <div className="aspect-[16/9] overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="relative h-full w-full"
          >
            <Image
              src={imageProps.src}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={imageProps.unoptimized}
            />
          </motion.div>
        </div>

        <div className="p-6">
          <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2 leading-tight">
            {title}
          </h3>
          
          <p className="mb-4 line-clamp-2 text-muted-foreground">
            {description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
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
