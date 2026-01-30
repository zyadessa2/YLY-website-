"use client";

import { motion } from "framer-motion";
import { EventCard } from "./EventCard";
import { EventItem } from "@/lib/api";
import { getNextImageProps } from "@/lib/utils/google-drive-image";
import { useState } from "react";

interface EventDetailsClientProps {
  initialData: EventItem[];
}

export const EventDetailsClient = ({
  initialData,
}: EventDetailsClientProps) => {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 9;
  
  // Transform database events to match EventCard props
  const transformedEvents = initialData.map((event) => {
    // Get title and description
    const title = event.title || event.arabicTitle || '';
    const description = event.description || event.arabicDescription || '';
    
    // Get image props using the utility function
    const imageProps = getNextImageProps(
      event.coverImage, 
      "/images/eventLogos/YLY-Competition-1024x1024.png"
    );
    
    // derive status from event dates if not provided by backend
    const now = new Date();
    const start = event.eventDate ? new Date(event.eventDate) : null;
    const end = event.endDate ? new Date(event.endDate) : start;
    let computedStatus: string | undefined = undefined;
    if (start && end) {
      if (end < now) computedStatus = 'completed';
      else if (start <= now && end >= now) computedStatus = 'ongoing';
      else computedStatus = 'upcoming';
    }

    return {
      id: event._id,
      logo: imageProps.src,
      title,
      description,
      date: new Date(event.eventDate).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      link: `/events/${event.slug}`,
      unoptimized: imageProps.unoptimized,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (event as any).status || computedStatus,
    };
  });

  const displayedEvents = showAll
    ? transformedEvents
    : transformedEvents.slice(0, initialDisplayCount);
  const hasMoreEvents = transformedEvents.length > initialDisplayCount;

  // Split events for featured layout
  const featuredEvent = displayedEvents[0];
  const secondaryEvents = displayedEvents.slice(1, 3);
  const regularEvents = displayedEvents.slice(3);

  return (
    <>
      {transformedEvents.length > 0 && (
        <div className="space-y-8">
          {/* Featured + Secondary Grid (Magazine Style) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Event - Large */}
            {featuredEvent && (
              <div className="lg:col-span-2">
                <EventCard {...featuredEvent} variant="featured" index={0} />
              </div>
            )}
            
            {/* Secondary Events - Stacked */}
            <div className="space-y-6">
              {secondaryEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  {...event}
                  variant="secondary"
                  index={index + 1}
                />
              ))}
            </div>
          </div>

          {/* Regular Grid */}
          {regularEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {regularEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  {...event}
                  variant="regular"
                  index={index + 3}
                />
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Empty state */}
      {transformedEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-[400px] items-center justify-center"
        >
          <p className="text-lg text-muted-foreground">
            لا توجد فعاليات حالياً
          </p>
        </motion.div>
      )}

      {/* Load More Button */}
      {hasMoreEvents && (
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
