"use client";

import { motion } from "framer-motion";
import { EventCard } from "./EventCard";
import { EventItem } from "@/lib/database";

interface EventDetailsClientProps {
  initialData: EventItem[];
}

export const EventDetailsClient = ({
  initialData,
}: EventDetailsClientProps) => {
  // Transform database events to match EventCard props
  const transformedEvents = initialData.map((event) => ({
    id: event.id,
    logo: event.cover_image || "/images/eventLogos/YLY-Competition-1024x1024.png",
    title: event.title,
    description: event.description,
    date: new Date(event.event_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    link: `/events/${event.slug}`,
  }));

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
