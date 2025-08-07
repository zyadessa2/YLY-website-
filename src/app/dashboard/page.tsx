"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardService } from "@/lib/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Calendar, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalNews: number;
  totalEvents: number;
  recentNews: number;
  recentEvents: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    totalEvents: 0,
    recentNews: 0,
    recentEvents: 0,
  });
  const [recentNews, setRecentNews] = useState<
    { id: string; title: string; created_at: string; slug: string }[]
  >([]);
  const [recentEvents, setRecentEvents] = useState<
    { id: string; title: string; event_date: string; slug: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        // If no user, redirect to signin
        if (!user) {
          window.location.href = "/signin";
          return;
        }

        // Load dashboard stats and recent content with individual try/catch blocks
        // to prevent one failure from stopping the others
        try {
          const statsData = await DashboardService.getStats();
          setStats(statsData);
        } catch (statsError) {
          console.error("Error loading stats:", statsError);
          // Keep default stats values
        }

        try {
          const recentNewsData = await DashboardService.getRecentNews();
          setRecentNews(recentNewsData || []);
        } catch (newsError) {
          console.error("Error loading recent news:", newsError);
        }

        try {
          const recentEventsData = await DashboardService.getRecentEvents();
          setRecentEvents(recentEventsData || []);
        } catch (eventsError) {
          console.error("Error loading recent events:", eventsError);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        window.location.href = "/signin";
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: "Add News",
      description: "Create a new news article",
      href: "/dashboard/news/add",
      icon: Newspaper,
      color: "bg-blue-500",
    },
    {
      title: "Add Event",
      description: "Create a new event",
      href: "/dashboard/events/add",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      title: "View News",
      description: "Manage existing news",
      href: "/dashboard/news",
      icon: Eye,
      color: "bg-purple-500",
    },
    {
      title: "View Events",
      description: "Manage existing events",
      href: "/dashboard/events",
      icon: Eye,
      color: "bg-orange-500",
    },
    {
      title: "Governorate",
      description: "Manage existing Governorate",
      href: "/dashboard/governorates",
      icon: Eye,
      color: "bg-purple-500",
    },
    {
      title: "Add Governorate",
      description: "Manage existing Governorate",
      href: "/dashboard/governorates/add",
      icon: Eye,
      color: "bg-orange-500",
    },
  ];

  const statCards = [
    {
      title: "Total News",
      value: stats.totalNews,
      description: "Published articles",
      icon: Newspaper,
      color: "text-blue-600",
    },
    {
      title: "Total Events",
      value: stats.totalEvents,
      description: "Scheduled events",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Recent News",
      value: stats.recentNews,
      description: "Last 30 days",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Recent Events",
      value: stats.recentEvents,
      description: "Last 30 days",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>{" "}
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.email || "Admin"}! Here&apos;s what&apos;s
            happening with your content.
          </p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <Link href={action.href}>
                <CardHeader className="pb-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}
                  >
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </div>{" "}
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Newspaper className="mr-2 h-5 w-5" />
              Recent News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNews.length > 0 ? (
                recentNews.map((news) => (
                  <div
                    key={news.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{news.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(news.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/news/edit/${news.id}`}>Edit</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent news</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.event_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/events/edit/${event.id}`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent events
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
