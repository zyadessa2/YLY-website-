"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapIcon,
  UsersIcon,
  TrendingUpIcon,
  HeartHandshakeIcon,
  ArrowRight,
  GlobeIcon,
  BuildingIcon,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const FeaturesSection = () => {
  const t = useTranslations("governorate.features");

  const features = [
    {
      icon: UsersIcon,
      title: t("items.youthEmpowerment.title"),
      description: t("items.youthEmpowerment.description"),
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: TrendingUpIcon,
      title: t("items.leadershipDevelopment.title"),
      description: t("items.leadershipDevelopment.description"),
      color: "from-green-500 to-green-600",
    },
    {
      icon: HeartHandshakeIcon,
      title: t("items.communityService.title"),
      description: t("items.communityService.description"),
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: MapIcon,
      title: t("items.eventOrganization.title"),
      description: t("items.eventOrganization.description"),
      color: "from-red-500 to-red-600",
    },
    {
      icon: GlobeIcon,
      title: t("items.digitalInnovation.title"),
      description: t("items.digitalInnovation.description"),
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: BuildingIcon,
      title: t("items.laborMarketPreparation.title"),
      description: t("items.laborMarketPreparation.description"),
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-background via-secondary/5 to-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-foreground mb-6"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-900/50 dark:to-gray-800/30 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t("cta.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("cta.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="group">
                  <Link href="#map-section">
                    {t("cta.exploreButton")}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">{t("cta.joinButton")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
