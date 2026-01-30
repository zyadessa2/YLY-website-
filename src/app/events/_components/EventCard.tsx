"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Clock, Sparkles } from "lucide-react";

interface EventCardProps {
  logo: string;
  title: string;
  description: string;
  date: string;
  link: string;
  unoptimized?: boolean;
  variant?: "featured" | "secondary" | "regular";
  index?: number;
  status?: string;
}

export const EventCard = ({
  logo,
  title,
  description,
  date,
  link,
  unoptimized = false,
  variant = "regular",
  index = 0,
  status,
}: EventCardProps) => {
  // Featured Event (Large with overlay text)
  if (variant === "featured") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group relative overflow-hidden rounded-2xl h-[600px]"
      >
        <Link href={link}>
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={logo}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 66vw"
              unoptimized={unoptimized}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-full bg-primary/90 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                فعالية مميزة
              </span>
              {status && (
                <span className="rounded-full bg-green-500/90 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                  {status === 'upcoming' ? 'قريباً' : status === 'ongoing' ? 'جاري' : 'منتهي'}
                </span>
              )}
            </div>
            
            <h2 className="mb-4 text-4xl font-bold text-white leading-tight line-clamp-3 drop-shadow-lg">
              {title}
            </h2>
            
            <p className="mb-6 text-lg text-white/90 line-clamp-2 drop-shadow">
              {description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-medium">{date}</span>
              </div>
              <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
                <span className="text-sm font-medium">التفاصيل</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // Secondary Event (Medium horizontal)
  if (variant === "secondary") {
    return (
      <motion.article
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
      >
        <Link href={link} className="flex flex-col h-full">
          <div className="aspect-[16/10] overflow-hidden">
            <Image
              src={logo}
              alt={title}
              width={400}
              height={250}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              unoptimized={unoptimized}
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
                <Clock className="h-3 w-3" />
                <span>{date}</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // Regular Event (Standard card)
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-xl hover:border-primary/50 transition-all duration-300"
    >
      <Link href={link} className="block">
        <div className="relative aspect-video overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="relative h-full w-full"
          >
            <Image
              src={logo}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={unoptimized}
            />
          </motion.div>
        </div>
        
        <div className="p-6">
          {status && (
            <span className="inline-block mb-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {status === 'upcoming' ? 'قريباً' : status === 'ongoing' ? 'جاري الآن' : 'منتهي'}
            </span>
          )}
          
          <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2 leading-tight">
            {title}
          </h3>
          
          <p className="mb-4 line-clamp-2 text-muted-foreground">
            {description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
