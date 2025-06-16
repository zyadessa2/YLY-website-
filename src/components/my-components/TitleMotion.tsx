"use client";

import { motion } from "framer-motion";

interface TitleMotionProps {
  title: string;
  className?: string;
}

const TitleMotion = ({ title, className = "" }: TitleMotionProps) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`bg-clip-text text-transparent text-center 
        bg-gradient-to-r from-primary via-primary/80 to-secondary
        dark:from-primary dark:via-secondary dark:to-primary
        text-5xl md:text-5xl lg:text-7xl 
        font-sans py-2 md:py-10 
        relative z-20 
        font-bold tracking-tight 
        mt-10 
        ${className}`}
    >
      {title}
    </motion.h2>
  );
};

export default TitleMotion;
