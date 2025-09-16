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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative aspect-square overflow-hidden rounded-xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </motion.div>
    </Link>
  );
};
