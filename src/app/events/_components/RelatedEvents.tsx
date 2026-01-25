"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { eventsService, EventItem } from "@/lib/api";
import { processImageUrl } from "@/lib/image-upload";
import { getDriveImageUrl, isDriveUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface RelatedEventsProps {
  currentEventId: string;
}

// Helper functions to get display text and image URL from event item
const getTitle = (event: EventItem): string => event.title || event.arabicTitle || '';
const getDescription = (event: EventItem): string => event.description || event.arabicDescription || '';
const getLocation = (event: EventItem): string => event.location || event.arabicLocation || '';
const getImage = (event: EventItem): string => {
  const raw = event.coverImage || "/images/eventLogos/YLY-Competition-1024x1024.png";
  return getDriveImageUrl(raw) || processImageUrl(raw) || "/images/eventLogos/YLY-Competition-1024x1024.png";
};
const isGoogleDrive = (event: EventItem): boolean => isDriveUrl(event.coverImage);

export const RelatedEvents = ({ currentEventId }: RelatedEventsProps) => {
  const [relatedEvents, setRelatedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedEvents = async () => {
      try {
        const response = await eventsService.getAll({ published: true, limit: 10 });
        const filtered = response.data
          .filter((event) => event._id !== currentEventId)
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
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/events/${event.slug}`} className="flex">
              {/* Content Left */}
              <div className="flex-1 p-4">
                <h4 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {getTitle(event)}
                </h4>
                <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                  {getDescription(event)}
                </p>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>
                    📅 {new Date(event.eventDate).toLocaleDateString()}
                  </span>
                  <span>📍 {getLocation(event)}</span>
                </div>
              </div>

              {/* Image Right */}
              <div className="w-24 h-20 relative flex-shrink-0">
                <Image
                  src={getImage(event)}
                  alt={getTitle(event)}
                  fill
                  className="object-cover"
                  unoptimized={isGoogleDrive(event)}
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
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/events/${event.slug}`}>
              {/* Image Top */}
              <div className="w-full h-32 relative">
                <Image
                  src={getImage(event)}
                  alt={getTitle(event)}
                  fill
                  className="object-cover"
                  unoptimized={isGoogleDrive(event)}
                />
              </div>

              {/* Content Bottom */}
              <div className="p-3">
                <h4 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {getTitle(event)}
                </h4>
                <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                  {getDescription(event)}
                </p>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>
                    📅 {new Date(event.eventDate).toLocaleDateString()}
                  </span>
                  <span>📍 {getLocation(event)}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
