"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Newspaper, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { GovernorateStatsProps } from "@/types/governorate";

export function GovernorateStats({
  governorate,
  newsCount,
  eventsCount,
}: GovernorateStatsProps) {
  const t = useTranslations("governorate.detail.stats");
  
  const stats = [
    {
      title: t("upcomingEvents"),
      value: eventsCount,
      icon: Calendar,
      description: t("scheduledActivities"),
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: t("newsArticles"),
      value: newsCount,
      icon: Newspaper,
      description: t("publishedStories"),
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: t("programs"),
      value: governorate.yly_stats.programs_count,
      icon: Trophy,
      description: t("activeInitiatives"),
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {t("title", { governorate: governorate.name })}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("description", { governorate: governorate.name })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center align-middle">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg dark:hover:shadow-xl transition-shadow bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            >
              <CardHeader className="pb-2">
                <div
                  className={`mx-auto p-3 rounded-full w-fit ${stat.bgColor}`}
                >
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                  {stat.value}
                </CardTitle>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
              {t("established")}{" "}
              {new Date(governorate.yly_stats.members_count * 30).getFullYear()}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
              {t("growingCommunity")}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
              {t("youthFocused")}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
              {t("localImpact")}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
