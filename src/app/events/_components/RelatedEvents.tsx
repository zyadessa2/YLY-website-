"use client";

import { motion } from "framer-motion";
import { EventCard } from "./EventCard";
import { eventsData } from "../_data/events";

interface RelatedEventsProps {
  currentEventId: string;
}

export const RelatedEvents = ({ currentEventId }: RelatedEventsProps) => {
  const relatedEvents = eventsData
    .filter((event) => event.id !== currentEventId)
    .slice(0, 3);

  return (
    <section className="bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">Related Events</h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {relatedEvents.map((event) => (
            <EventCard
              key={event.id}
              logo={event.logo}
              title={event.title}
              description={event.description}
              date={event.date}
              link={`/events/${event.slug}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
