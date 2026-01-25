"use client";

import { motion } from "framer-motion";
import { EventLogo } from "./EventLogo";
import TitleMotion from "@/components/my-components/TitleMotion";

export const CentralEvents = () => {
  const events = [
    {
      src: "/images/centralEvents/five in one s6.png",
      alt: "5 in 1 Event",
      href: "#5-in-1",
    },
    {
      src: "/images/centralEvents/bazaar-blue-yellow.png",
      alt: "Bazaar Event",
      href: "#bazaar",
    },
    {
      src: "/images/centralEvents/learn 8 (Learn Kemet).png",
      alt: "Learn Kemet Event",
      href: "#learn-kemet",
    },
    {
      src: "/images/centralEvents/ctrl.png",
      alt: "CTRL Event",
      href: "#ctrl",
    },
    {
      src: "/images/centralEvents/y n way-01.png",
      alt: "YNWay Event",
      href: "#ynway",
    },
    {
      src: "/images/centralEvents/YLP Logo.png",
      alt: "YLP Event",
      href: "#ylp",
    },
    {
      src: "/images/centralEvents/closing_(2).png",
      alt: "Closing Event",
      href: "#closing",
    },
    {
      src: "/images/centralEvents/COLOR YLY Services.png",
      alt: "YLY Services Event",
      href: "#yly-services",
    },
    {
      src: "/images/centralEvents/original logo.png",
      alt: "Original Logo Event",
      href: "#original-logo",
    },
    {
      src: "/images/centralEvents/tmsk-02.png",
      alt: "TMSK Event",
      href: "#tmsk",
    },
    {
      src: "/images/centralEvents/أهل.png",
      alt: "Ahl Event",
      href: "#ahl",
    },
    {
      src: "/images/centralEvents/وثق(1).png",
      alt: "Wathaaq Event",
      href: "#wathaaq",
    },
  ];

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
      <TitleMotion title="YLY Central Events" className="mb-12" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {events.map((event, index) => (
          <motion.div
            key={event.alt}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-32 sm:h-40"
          >
            <EventLogo {...event} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
