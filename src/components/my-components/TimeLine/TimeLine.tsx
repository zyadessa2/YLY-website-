"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface TimelineItemProps {
  children: React.ReactNode;
  isLast?: boolean;
  position?: "left" | "right";
}

const TimelineItem = ({
  children,
  isLast,
  position = "left",
}: TimelineItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center",
        position === "right" ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "w-1/2 px-4",
          position === "right" ? "text-left" : "text-right"
        )}
      >
        {children}
      </div>
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-primary border-4 border-background" />
        {!isLast && <div className="w-0.5 h-24 bg-border" />}
      </div>
      <div className="w-1/2" />
    </div>
  );
};

const TimeLine = () => {
  const t = useTranslations("home.timeline");

  const visions = [
    { id: "1", position: "left" },
    { id: "2", position: "right" },
    { id: "3", position: "left" },
    { id: "4", position: "right" },
    { id: "5", position: "left" },
    { id: "6", position: "right" },
  ] as const;

  return (
    <div className="container mx-auto py-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-12"
      >
        {t("title")}
      </motion.h2>

      <div className="space-y-0">
        {visions.map((vision, index) => (
          <TimelineItem
            key={vision.id}
            position={vision.position as "left" | "right"}
            isLast={index === visions.length - 1}
          >
            <motion.div
              initial={{
                opacity: 0,
                x: vision.position === "left" ? -50 : 50,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-card p-4 rounded-lg shadow-lg"
            >
              <h3 className="font-semibold mb-2">
                {t(`visions.${vision.id}.title`)}
              </h3>
              <p className="text-muted-foreground">
                {t(`visions.${vision.id}.description`)}
              </p>
            </motion.div>
          </TimelineItem>
        ))}
      </div>
    </div>
  );
};

export default TimeLine;
