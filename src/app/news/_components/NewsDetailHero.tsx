"use client";

import { motion } from "framer-motion";
import { CalendarIcon, UserIcon, ClockIcon, MapPinIcon, EyeIcon } from "lucide-react";

interface NewsDetailHeroProps {
  title: string;
  date: string;
  author: string;
  image: string;
  governorate?: string;
  viewCount?: number;
}

export const NewsDetailHero = ({
  title,
  date,
  author,
  image,
  governorate,
  viewCount,
}: NewsDetailHeroProps) => {
  // Format the date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if date is invalid
    }

    // Format date as: June 30, 2025
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return ""; // Return empty string if date is invalid
    }

    // Format time as: 3:30 PM
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return date.toLocaleTimeString("en-US", options);
  };
  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/50">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)",
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl text-center"
        >
          <h1 className="mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            {title}
          </h1>
          <div className="flex flex-col items-center justify-center space-y-2 text-white">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-white/80" />
                <span className="font-medium">{formatDate(date)}</span>
              </div>
              <span className="hidden md:inline text-white/50">|</span>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-white/80" />
                <span>{formatTime(date)}</span>
              </div>
              <span className="hidden md:inline text-white/50">|</span>
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-white/80" />
                <span>{author}</span>
              </div>
              {governorate && (
                <>
                  <span className="hidden md:inline text-white/50">|</span>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-white/80" />
                    <span>{governorate}</span>
                  </div>
                </>
              )}
              {viewCount !== undefined && viewCount > 0 && (
                <>
                  <span className="hidden md:inline text-white/50">|</span>
                  <div className="flex items-center gap-2">
                    <EyeIcon className="h-4 w-4 text-white/80" />
                    <span>{viewCount.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100px" }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-2 h-0.5 bg-white/30"
            />
          </div>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block h-[50px] w-[calc(100%+1.3px)]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ d: "M0,0 L1200,0 L1200,120 L0,120 Z" }}
            animate={{
              d: "M0,120 C300,90 600,120 900,90 C1100,70 1200,90 1200,90 L1200,120 L0,120 Z",
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};
