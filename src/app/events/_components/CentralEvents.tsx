"use client";

import { motion } from "framer-motion";
import { EventLogo } from "./EventLogo";
import TitleMotion from "@/components/my-components/TitleMotion";

export const CentralEvents = () => {
  const events = [
    {
      src: "/images/eventLogos/5-1n-1-1024x1024.png",
      alt: "5 in 1 Event",
      href: "#5-in-1",
    },
    {
      src: "/images/eventLogos/Girls-Power.png",
      alt: "Girls Power Event",
      href: "#girls-power",
    },
    {
      src: "/images/eventLogos/Its-On-1024x1024.png",
      alt: "Its On Event",
      href: "#its-on",
    },
    {
      src: "/images/eventLogos/Learn-2-MM.png",
      alt: "Learn 2 Event",
      href: "#learn-2",
    },
    {
      src: "/images/eventLogos/YLY-Competition-1024x1024.png",
      alt: "YLY Competition",
      href: "#yly-competition",
    },
    {
      src: "/images/eventLogos/Zayed-Marathon-Logo-800.png",
      alt: "Zayed Marathon",
      href: "#zayed-marathon",
    },
  ];

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
      <TitleMotion title="YLY Central Events" className="mb-12" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4"
      >
        {events.map((event, index) => (
          <motion.div
            key={event.alt}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <EventLogo {...event} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
