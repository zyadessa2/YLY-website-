"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

const Hero = () => {
  const t = useTranslations('home')
  
  return (    
  <section className="relative h-screen flex items-center justify-center overflow-hidden pt-32">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Youth Leading Youth Hero Background"
          fill
          className="object-cover"
          priority
        />
        {/* Darker gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-black/75" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-5xl mx-auto">
          
          {/* Clean, Simple Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-white drop-shadow-2xl"
          >
            {t(`hero.title`)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/95 mb-12 leading-relaxed font-medium drop-shadow-lg max-w-3xl mx-auto"
          >
            {t(`hero.description`)}
          </motion.p>

          {/* Clean CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/news"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-600 rounded-xl 
              font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/30"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                {t(`hero.button`)}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>

            <Link
              href="/events"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/80 
              text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 
              hover:bg-white/20 hover:shadow-2xl hover:shadow-white/20"
            >
              <Calendar className="w-5 h-5" />
              الفعاليات
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/60 rounded-full p-1 bg-white/5 backdrop-blur-sm">
          <motion.div 
            className="w-1.5 h-3 bg-white rounded-full mx-auto"
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>

      {/* Wave transition to next section */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none z-20">
        <svg
          className="relative block h-[50px] w-[calc(100%+1.3px)]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ d: "M0,0 L1200,0 L1200,120 L0,120 Z" }}
            animate={{
              d: "M0,120 L0,60 C150,90 350,0 650,60 C950,120 1050,60 1200,40 L1200,120 Z",
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
      {/* <FloatingCta /> */}
    </section>
  );
};

export default Hero;
