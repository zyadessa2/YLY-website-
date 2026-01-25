"use client";

import { useEffect, useState } from "react";
import { authService, dashboardService, DashboardStats, RecentNewsItem, RecentEventItem } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Calendar, TrendingUp, Users, Eye, Shield } from "lucide-react";
import Link from "next/link";

// Helper to get text - handles both new API format (separate fields) and legacy format (bilingual object)
const getText = (item: RecentNewsItem | RecentEventItem): string => {
  // New API format with separate arabicTitle/title fields
  if ('arabicTitle' in item && item.arabicTitle) {
    return item.title || item.arabicTitle;
  }
  // Legacy format with bilingual object
  if (typeof item.title === 'object' && item.title !== null) {
    const bilingualTitle = item.title as { ar: string; en: string };
    return bilingualTitle.en || bilingualTitle.ar || '';
  }
  // Simple string
  return String(item.title || '');
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    totalEvents: 0,
    publishedNews: 0,
    publishedEvents: 0,
  });
  const [recentNews, setRecentNews] = useState<RecentNewsItem[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string; role?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Check authentication using auth service
        const storedUser = authService.getStoredUser();
        
        // If no user or not authenticated, redirect to signin
        if (!storedUser || !authService.isAuthenticated()) {
          window.location.href = "/signin";
          return;
        }
        
        setUser({ email: storedUser.email, role: storedUser.role });
        setIsAdmin(authService.isAdmin());

        // Load dashboard stats and recent content with individual try/catch blocks
        try {
          const statsData = await dashboardService.getStats();
          setStats(statsData);
        } catch (statsError) {
          console.error("Error loading stats:", statsError);
        }

        try {
          const recentNewsData = await dashboardService.getRecentNews();
          setRecentNews(recentNewsData || []);
        } catch (newsError) {
          console.error("Error loading recent news:", newsError);
        }

        try {
          const recentEventsData = await dashboardService.getRecentEvents();
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

  // Build quick actions based on user role
  const getQuickActions = () => {
    const baseActions = [
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
    ];

    // Admin-only actions
    if (isAdmin) {
      baseActions.push(
        {
          title: "Manage Users",
          description: "User management",
          href: "/dashboard/users",
          icon: Users,
          color: "bg-indigo-500",
        },
        {
          title: "Governorates",
          description: "Manage governorates",
          href: "/dashboard/governorates",
          icon: Shield,
          color: "bg-teal-500",
        }
      );
    }

    return baseActions;
  };

  // Build stat cards based on available data and user role
  const getStatCards = () => {
    const cards = [
      {
        title: "Total News",
        value: stats.totalNews,
        description: "All articles",
        icon: Newspaper,
        color: "text-blue-600",
      },
      {
        title: "Total Events",
        value: stats.totalEvents,
        description: "All events",
        icon: Calendar,
        color: "text-green-600",
      },
      {
        title: "Published News",
        value: stats.publishedNews,
        description: "Live articles",
        icon: TrendingUp,
        color: "text-purple-600",
      },
      {
        title: "Published Events",
        value: stats.publishedEvents,
        description: "Live events",
        icon: TrendingUp,
        color: "text-orange-600",
      },
    ];

    // Add admin-specific stats
    if (isAdmin && stats.totalUsers !== undefined) {
      cards.push({
        title: "Total Users",
        value: stats.totalUsers,
        description: `${stats.activeUsers || 0} active`,
        icon: Users,
        color: "text-indigo-600",
      });
    }

    return cards;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const quickActions = getQuickActions();
  const statCards = getStatCards();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Welcome back, {user?.email || "Admin"}! 
            {isAdmin && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Admin</span>}
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      </div>
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
                    key={news._id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{getText(news)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(news.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/news/edit/${news._id}`}>Edit</Link>
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
                    key={event._id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{getText(event)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/events/edit/${event._id}`}>
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
