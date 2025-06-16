"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

interface NewsCardProps {
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  slug: string;
  index: number;
}

export const NewsCard = ({
  title,
  description,
  image,
  date,
  author,
  slug,
  index,
}: NewsCardProps) => {
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
            <Image
              src={image}
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
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
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
