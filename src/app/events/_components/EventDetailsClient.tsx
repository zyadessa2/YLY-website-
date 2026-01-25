"use client";

import { motion } from "framer-motion";
import { EventCard } from "./EventCard";
import { EventItem } from "@/lib/api";
import { processImageUrl } from "@/lib/image-upload";
import { getDriveImageUrl, isDriveUrl } from "@/lib/utils";

interface EventDetailsClientProps {
  initialData: EventItem[];
}

export const EventDetailsClient = ({
  initialData,
}: EventDetailsClientProps) => {
  // Transform database events to match EventCard props
  const transformedEvents = initialData.map((event) => {
    // Get title - API returns separate fields (title, arabicTitle)
    const title = event.title || event.arabicTitle || '';
    const description = event.description || event.arabicDescription || '';
    
    // Handle cover image - could be Drive URL or regular URL
    const rawImage = event.coverImage || "/images/eventLogos/YLY-Competition-1024x1024.png";
    const isGoogleDrive = isDriveUrl(rawImage);
    const logo = getDriveImageUrl(rawImage) || processImageUrl(rawImage) || "/images/eventLogos/YLY-Competition-1024x1024.png";
    
    return {
      id: event._id,
      logo,
      title,
      description,
      date: new Date(event.eventDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      link: `/events/${event.slug}`,
      unoptimized: isGoogleDrive,
    };
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {transformedEvents.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </motion.div>

      {/* Empty state */}
      {initialData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-[400px] items-center justify-center"
        >
          <p className="text-lg text-muted-foreground">
            No events available yet.
          </p>
        </motion.div>
      )}
    </>
  );
};
