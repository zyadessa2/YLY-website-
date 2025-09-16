"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Bell, ArrowRight, Newspaper, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { GovernorateNewsProps } from "@/types/governorate";

export function GovernorateNews({ governorateName }: GovernorateNewsProps) {
  const t = useTranslations("governorate.features.comingSoon.news");

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Newspaper className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {t("title")}
          </h2>
          <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-4">
            {t("subtitle", { governorate: governorateName })}
          </p>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("description", { governorate: governorateName })}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full opacity-20 translate-y-12 -translate-x-12"></div>

            <CardContent className="p-12 text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-8 shadow-lg">
                <Clock className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Coming Soon...
              </h3>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  Exciting Updates in Progress
                </span>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
                Our team is preparing amazing content about our latest
                achievements, community initiatives, and impact stories from{" "}
                {governorateName}.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Bell className="w-5 h-5 mr-2" />
                  {t("notifyButton")}
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  asChild
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Link href="/news">
                    {t("learnMore")}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
