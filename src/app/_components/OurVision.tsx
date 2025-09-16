"use client";

import TimeLine from "@/components/my-components/TimeLine/TimeLine";
import TitleMotion from "@/components/my-components/TitleMotion";
import { useTranslations } from "next-intl";
import React from "react";

const VisionPoint = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center space-x-2 mb-4">
    <div className="h-2 w-2 rounded-full bg-secondary shrink-0" />
    <p className="text-lg text-muted-foreground">{children}</p>
  </div>
);

const OurVision = () => {
  const t = useTranslations("home.vision");

  const committees = [
    "hr",
    "sm",
    "pr",
    "or",
    "rd",
    "media",
    "training",
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5" />
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <TitleMotion title={t("title")} className="mb-8 text-primary" />

          <div className="space-y-8 backdrop-blur-sm bg-background/50 rounded-xl p-6 md:p-8 shadow-lg">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              {t("description")}
            </p>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary">
                {t("keyObjectives")}
              </h3>
              <VisionPoint>{t("objectives.promote")}</VisionPoint>
              <VisionPoint>{t("objectives.build")}</VisionPoint>
              <VisionPoint>{t("objectives.prepare")}</VisionPoint>
              <VisionPoint>{t("objectives.establish")}</VisionPoint>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">
                {t("reach.title")}
              </h3>
              <p className="text-lg text-muted-foreground">
                {t("reach.description")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {committees.map((committee) => (
                  <div
                    key={committee}
                    className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 text-center text-primary font-medium"
                  >
                    {t(`reach.committees.${committee}`)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <TimeLine />
        </div>
      </div>
    </div>
  );
};

export default OurVision;
