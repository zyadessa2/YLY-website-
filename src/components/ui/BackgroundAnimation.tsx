"use client";

import { motion } from "framer-motion";

export const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0"
      >
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-full h-full"
            animate={{
              y: ["100%", "-100%"],
              x: ["100%", "-100%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
              delay: index * 15,
            }}
          >
            <svg
              className="w-full h-full scale-150 opacity-20"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 0,50 C 20,30 40,70 60,50 C 80,30 100,70 100,50"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
                fill="none"
                className="text-blue-500 dark:text-blue-400"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 20,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            </svg>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
