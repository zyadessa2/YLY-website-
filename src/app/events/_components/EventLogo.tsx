"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface EventLogoProps {
  src: string;
  alt: string;
  href: string;
}

export const EventLogo = ({ src, alt, href }: EventLogoProps) => {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative h-full aspect-square overflow-hidden rounded-lg bg-background border border-border p-2 shadow-md transition-shadow hover:shadow-lg"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 40vw, (max-width: 1200px) 25vw, 16vw"
        />
      </motion.div>
    </Link>
  );
};
