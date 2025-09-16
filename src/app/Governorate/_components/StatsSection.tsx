"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export const StatsSection = () => {
  const t = useTranslations("governorate.stats");

  const stats = [
    {
      number: t("governorates.number"),
      label: t("governorates.label"),
      description: t("governorates.description"),
      icon: "🏛️",
    },
    {
      number: t("volunteers.number"),
      label: t("volunteers.label"),
      description: t("volunteers.description"),
      icon: "👥",
    },
    {
      number: t("events.number"),
      label: t("events.label"),
      description: t("events.description"),
      icon: "🎯",
    },
    {
      number: t("applicants.number"),
      label: t("applicants.label"),
      description: t("applicants.description"),
      icon: "📝",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="text-center h-full bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-900/50 dark:to-gray-800/30 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
