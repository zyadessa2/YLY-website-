"use client";

import { motion } from "framer-motion";

interface TitleMotionProps {
  title: string;
  className?: string;
}

const TitleMotion = ({ title, className = "" }: TitleMotionProps) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center mb-12 px-4">
      {/* Decorative line */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full mb-6 flex-shrink-0"
      />
      
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center text-foreground tracking-tight leading-tight px-2 ${className}`}
        style={{
          fontFamily: "'Inter', 'Cairo', sans-serif",
        }}
      >
        {title}
      </motion.h2>
      
      {/* Decorative underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="h-1 w-32 bg-gradient-to-r from-purple-600 to-primary rounded-full mt-3 origin-center flex-shrink-0"
      />
    </div>
  );
};

export default TitleMotion;
