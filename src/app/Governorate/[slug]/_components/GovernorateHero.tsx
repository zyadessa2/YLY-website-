"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { GovernorateHeroProps } from "@/types/governorate";

export function GovernorateHero({ governorate }: GovernorateHeroProps) {
  const t = useTranslations("governorate.detail.hero");
  
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/footer bg.jpg"
          alt={governorate.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold">
              {t("ylyIn")} {governorate.name}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold opacity-90">
              {governorate.arabic_name}
            </h2>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
            {t("description", { governorate: governorate.name })}
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/20 dark:bg-white/10 text-white border-white/30 dark:border-white/20 backdrop-blur-sm">
              <MapPin className="mr-2 h-4 w-4" />
              {t("stats.capital", { capital: governorate.capital })}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/20 dark:bg-white/10 text-white border-white/30 dark:border-white/20 backdrop-blur-sm">
              <Users className="mr-2 h-4 w-4" />
              {t("stats.population", { population: governorate.population })}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/20 dark:bg-white/10 text-white border-white/30 dark:border-white/20 backdrop-blur-sm">
              <Globe className="mr-2 h-4 w-4" />
              {t("stats.area", { area: governorate.area })}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
