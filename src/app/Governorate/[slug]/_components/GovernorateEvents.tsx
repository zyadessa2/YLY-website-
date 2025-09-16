"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Bell, ArrowRight, Users, Sparkles, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { GovernorateEventsProps } from "@/types/governorate";

export function GovernorateEvents({ governorateName }: GovernorateEventsProps) {
  const t = useTranslations("governorate.features.comingSoon.events");

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6">
            <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {t("title")}
          </h2>
          <p className="text-lg text-emerald-600 dark:text-emerald-400 font-medium mb-4">
            {t("subtitle", { governorate: governorateName })}
          </p>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("description", { governorate: governorateName })}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800 rounded-full opacity-20 -translate-y-20 -translate-x-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-cyan-200 to-blue-200 dark:from-cyan-800 dark:to-blue-800 rounded-full opacity-20 translate-y-16 translate-x-16"></div>

            <CardContent className="p-12 text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-8 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Amazing Events in Planning
              </h3>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  Workshops • Training • Community Events
                </span>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
                We&rsquo;re organizing leadership workshops, skill development
                sessions, and community engagement events that will empower
                youth in {governorateName}.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Leadership
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Development
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Skills
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Training
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Community
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Events
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Bell className="w-5 h-5 mr-2" />
                  {t("notifyButton")}
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  asChild
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Link href="/contactUs">
                    {t("contactUs")}
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
