"use client";

import { motion } from "framer-motion";
import { MapIcon, BuildingIcon, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const GovernorateHero = () => {
  const t = useTranslations("governorate.hero");

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-secondary/80">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/images/footer bg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.3)",
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
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 flex justify-center"
          >
            <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
              <MapIcon className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <h1 className="mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            {t("title")}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8 text-lg text-white/90 md:text-xl max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 text-white/90"
          >
            <div className="flex items-center gap-2">
              <BuildingIcon className="h-5 w-5 text-white/80" />
              <span className="font-medium">{t("stats.governorates")}</span>
            </div>
            <span className="text-white/50">|</span>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-white/80" />
              <span>{t("stats.volunteers")}</span>
            </div>
            <span className="text-white/50">|</span>
            <div className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-white/80" />
              <span>{t("stats.events")}</span>
            </div>
          </motion.div>
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
