"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EventsService, EventItem } from "@/lib/database";
import Link from "next/link";
import Image from "next/image";

interface RelatedEventsProps {
  currentEventId: string;
}

export const RelatedEvents = ({ currentEventId }: RelatedEventsProps) => {
  const [relatedEvents, setRelatedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedEvents = async () => {
      try {
        const allEvents = await EventsService.getAllEvents();
        const filtered = allEvents
          .filter((event) => event.id !== currentEventId)
          .slice(0, 3); // Show maximum 3 related events
        setRelatedEvents(filtered);
      } catch (error) {
        console.error("Error fetching related events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedEvents();
  }, [currentEventId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Related Events</h3>
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (relatedEvents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Related Events</h3>

      {/* Desktop Layout: Image right, content left, stacked vertically */}
      <div className="hidden lg:block space-y-4">
        {relatedEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/events/${event.slug}`} className="flex">
              {/* Content Left */}
              <div className="flex-1 p-4">
                <h4 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {event.title}
                </h4>
                <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                  {event.description}
                </p>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>
                    📅 {new Date(event.event_date).toLocaleDateString()}
                  </span>
                  <span>📍 {event.location}</span>
                </div>
              </div>

              {/* Image Right */}
              <div className="w-24 h-20 relative flex-shrink-0">
                <Image
                  src={
                    event.cover_image ||
                    "/images/eventLogos/YLY-Competition-1024x1024.png"
                  }
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mobile Layout: Grid style */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        {relatedEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/events/${event.slug}`}>
              {/* Image Top */}
              <div className="w-full h-32 relative">
                <Image
                  src={
                    event.cover_image ||
                    "/images/eventLogos/YLY-Competition-1024x1024.png"
                  }
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content Bottom */}
              <div className="p-3">
                <h4 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {event.title}
                </h4>
                <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                  {event.description}
                </p>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>
                    📅 {new Date(event.event_date).toLocaleDateString()}
                  </span>
                  <span>📍 {event.location}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
