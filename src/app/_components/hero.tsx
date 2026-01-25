"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
// import FloatingCta from "@/components/my-components/FloatingCta";


const Hero = () => {
  const t = useTranslations('home')
  return (    
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Youth Leading Youth Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 backdrop-blur-xs" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-center"
          >
           {/* اتحاد وزارة الشباب والرياضة YLY */}
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-center"
          >
            {/* Youth Leading Youth */}
            {t(`hero.title`)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-8 text-center"
          >
            {t(`hero.description`)}
            {/* Building tomorrow&apos;s leaders today through youth empowerment and
            community engagement. */}
          </motion.p>          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 
              text-white rounded-lg transition-all duration-300 transform hover:scale-105 group"
            >
              {t(`hero.button`)}
              {/* Learn More */}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
        <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
          <div className="w-1.5 h-3 bg-white/70 rounded-full mx-auto" />
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
