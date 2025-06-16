"use client";

import { motion } from "framer-motion";

export const ContactHero = () => {
  return (
    <section className="relative h-[60vh] overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/50">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)",
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl text-center"
        >
          <h1 className="mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            Get in Touch
          </h1>
          <p className="text-lg text-white/90 md:text-xl">
            Have questions? We&apos;d love to hear from you. Send us a message and
            we&apos;ll respond as soon as possible.
          </p>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block h-[50px] w-[calc(100%+1.3px)]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ d: "M0,0 L1200,0 L1200,120 L0,120 Z" }}
            animate={{
              d: "M0,120 C300,90 600,120 900,90 C1100,70 1200,90 1200,90 L1200,120 L0,120 Z",
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};
