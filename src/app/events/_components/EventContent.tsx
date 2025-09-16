"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface EventContentProps {
  content: string;
  images?: string[];
  registrationLink?: string;
  title?: string;
}

export const EventContent = ({
  content,
  images,
  registrationLink,
  title,
}: EventContentProps) => {
  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16">

      {/* Image Gallery */}
      {images && images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid gap-6 md:grid-cols-2"
        >
          {images.map((image, index) => (
            <motion.div
              key={image}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="relative aspect-video overflow-hidden rounded-xl"
            >
              <Image
                src={image}
                alt={title || 'Event image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-lg mx-auto max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Registration Button */}
      {registrationLink && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href={registrationLink}
            className="group relative overflow-hidden rounded-full bg-primary px-8 py-3 text-white transition-all hover:shadow-lg"
          >
            <span className="relative z-10 text-lg font-medium">
              Register Now
            </span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ type: "tween" }}
              style={{ mixBlendMode: "overlay" }}
            />
          </Link>
        </motion.div>
      )}
    </section>
  );
};
