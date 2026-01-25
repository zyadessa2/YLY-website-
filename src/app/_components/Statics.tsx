"use client";
import CountUp from "@/components/my-components/CountUp";
import TitleMotion from "@/components/my-components/TitleMotion";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";

interface StatItemProps {
  number: number;
  label: string;
  icon: React.ReactNode;
  delay?: number;
}

const StatItem = ({ number, label, icon, delay = 0 }: StatItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.05 }}
    className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-primary/10 hover:border-primary/20 transition-colors shadow-lg hover:shadow-xl"
  >
    <div className="absolute -top-6 bg-gradient-to-br from-primary to-secondary p-3 rounded-xl text-white shadow-lg">
      {icon}
    </div>{" "}
    <div dir="ltr">
      <CountUp
        from={0}
        to={number}
        separator=","
        direction="up"
        duration={2}
        className="count-up-text text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      />
    </div>
    <p className="mt-4 text-xl text-muted-foreground font-medium">{label}</p>
  </motion.div>
);

const Statics = () => {
  const t = useTranslations("home.stats");

  return (
    <div className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="container relative mx-auto px-4 ">
        <TitleMotion title={t("title")} className="mb-20" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start max-w-7xl mx-auto px-4">
          <StatItem
            number={60000}
            label={t("applicants.label")}
            delay={0}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />

          <StatItem
            number={200}
            label={t("events.label")}
            delay={0.2}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />

          <StatItem
            number={10000}
            label={t("volunteers.label")}
            delay={0.4}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Statics;
