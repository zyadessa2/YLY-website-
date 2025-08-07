"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Newspaper, Trophy } from "lucide-react";

interface GovernorateData {
  name: string;
  arabic_name: string;
  yly_stats: {
    members_count: number;
    events_count: number;
    news_count: number;
    programs_count: number;
  };
}

interface Props {
  governorate: GovernorateData;
  newsCount: number;
  eventsCount: number;
}

export function GovernorateStats({
  governorate,
  newsCount,
  eventsCount,
}: Props) {
  const stats = [
    {
      title: "Upcoming Events",
      value: eventsCount,
      icon: Calendar,
      description: "Scheduled activities",
      color: "text-green-600",
    },
    {
      title: "News Articles",
      value: newsCount,
      icon: Newspaper,
      description: "Published stories",
      color: "text-purple-600",
    },
    {
      title: "Programs",
      value: governorate.yly_stats.programs_count,
      icon: Trophy,
      description: "Active initiatives",
      color: "text-orange-600",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            YLY Impact in {governorate.name}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our growing community of young leaders is making a real difference
            across {governorate.name} governorate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center align-middle">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-2">
                <div
                  className={`mx-auto p-3 rounded-full bg-gray-100 w-fit ${stat.color}`}
                >
                  <stat.icon className="h-8 w-8" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-3xl font-bold mb-1">
                  {stat.value}
                </CardTitle>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {stat.title}
                </h3>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="px-4 py-2">
              Est.{" "}
              {new Date(governorate.yly_stats.members_count * 30).getFullYear()}
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Growing Community
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Youth Focused
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Local Impact
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
