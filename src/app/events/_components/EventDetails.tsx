"use client";

import { motion } from "framer-motion";
import { EventCard } from "./EventCard";
import TitleMotion from "@/components/my-components/TitleMotion";

const eventDetails = [
  {
    id: "5-in-1",
    logo: "/images/eventLogos/5-1n-1-1024x1024.png",
    title: "5 in 1 Championship",
    description:
      "A unique multi-sport championship that combines five different sports disciplines, testing athletes' versatility and overall fitness.",
    date: "August 15, 2025",
    link: "/events/5-in-1",
  },
  {
    id: "girls-power",
    logo: "/images/eventLogos/Girls-Power.png",
    title: "Girls Power Initiative",
    description:
      "Empowering young women through sports and leadership activities, creating opportunities for growth and development.",
    date: "September 1, 2025",
    link: "/events/girls-power",
  },
  {
    id: "its-on",
    logo: "/images/eventLogos/Its-On-1024x1024.png",
    title: "It's On Challenge",
    description:
      "An exciting fitness challenge that pushes participants to their limits while fostering teamwork and determination.",
    date: "September 20, 2025",
    link: "/events/its-on",
  },
  {
    id: "learn-2",
    logo: "/images/eventLogos/Learn-2-MM.png",
    title: "Learn 2 Program",
    description:
      "Educational initiative focused on teaching digital skills and programming to youth, preparing them for the future.",
    date: "October 5, 2025",
    link: "/events/learn-2",
  },
  {
    id: "yly-competition",
    logo: "/images/eventLogos/YLY-Competition-1024x1024.png",
    title: "YLY Annual Competition",
    description:
      "Our flagship competition bringing together youth from across the country to showcase their talents and skills.",
    date: "October 15, 2025",
    link: "/events/yly-competition",
  },
  {
    id: "zayed-marathon",
    logo: "/images/eventLogos/Zayed-Marathon-Logo-800.png",
    title: "Zayed Marathon",
    description:
      "Annual marathon honoring the legacy of Sheikh Zayed, promoting health and community spirit through running.",
    date: "November 1, 2025",
    link: "/events/zayed-marathon",
  },
];

export const EventDetails = () => {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16">
      <TitleMotion title="More Details" className="mb-12" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {eventDetails.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </motion.div>
    </section>
  );
};
