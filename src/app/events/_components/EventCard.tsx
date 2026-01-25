"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  logo: string;
  title: string;
  description: string;
  date: string;
  link: string;
  unoptimized?: boolean;
}

export const EventCard = ({
  logo,
  title,
  description,
  date,
  link,
  unoptimized = false,
}: EventCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl bg-card shadow-lg transition-all hover:shadow-xl"
    >
      <Link href={link} className="block">
        <div className="relative aspect-video overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <Image
              src={logo}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={unoptimized}
            />
          </motion.div>
        </div>
        <div className="p-6">
          <div className="mb-2 text-sm text-muted-foreground">{date}</div>
          <h3 className="mb-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </Link>
    </motion.article>
  );
};
