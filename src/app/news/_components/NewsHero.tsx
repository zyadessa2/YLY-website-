"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const NewsHero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary/50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/footer bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)",
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <motion.div
          initial={false}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-white md:text-8xl mb-4 leading-tight drop-shadow-2xl">
            أحدث الأخبار
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
            تابع آخر الأخبار والإنجازات من جميع المحافظات
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
            initial={false}
            animate={mounted ? {
              d: "M0,120 L0,60 C150,90 350,0 650,60 C950,120 1050,60 1200,40 L1200,120 Z",
            } : {
              d: "M0,0 L1200,0 L1200,120 L0,120 Z"
            }}
            transition={{
              duration: 5,
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
