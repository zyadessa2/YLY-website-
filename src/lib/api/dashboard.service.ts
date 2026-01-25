/**
 * Dashboard Service - Secure Dashboard Statistics
 * Aggregates data from multiple services for dashboard views
 */

import { authService } from './auth.service';
import { newsService, NewsStats } from './news.service';
import { eventsService, EventStats } from './events.service';
import { usersService, UserStats } from './users.service';
import { governoratesService } from './governorates.service';

// =====================
// Types
// =====================

export interface DashboardStats {
  totalNews: number;
  totalEvents: number;
  publishedNews: number;
  publishedEvents: number;
  totalUsers?: number;
  activeUsers?: number;
  totalGovernoratesStats?: number;
  upcomingEvents?: number;
  totalViews?: number;
  totalParticipants?: number;
}

export interface RecentNewsItem {
  _id: string;
  title: string;
  arabicTitle: string;
  slug: string;
  coverImage: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  governorateId: {
    name: string;
    arabicName: string;
    slug: string;
  };
}

export interface RecentEventItem {
  _id: string;
  title: string;
  arabicTitle: string;
  slug: string;
  coverImage: string;
  eventDate: string;
  location: string;
  published: boolean;
  governorateId: {
    name: string;
    arabicName: string;
    slug: string;
  };
}

export interface AdminDashboardData {
  stats: DashboardStats;
  newsStats: NewsStats;
  eventsStats: EventStats;
  userStats: UserStats;
  recentNews: RecentNewsItem[];
  recentEvents: RecentEventItem[];
}

export interface GovernorateDashboardData {
  stats: DashboardStats;
  recentNews: RecentNewsItem[];
  recentEvents: RecentEventItem[];
  governorateInfo: {
    _id: string;
    name: string;
    arabicName: string;
    slug: string;
  };
}

// =====================
// Service
// =====================

export const dashboardService = {
  /**
   * Get dashboard statistics based on user role
   */
  getStats: async (): Promise<DashboardStats> => {
    const user = authService.getStoredUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      if (authService.isAdmin()) {
        // Admin gets full statistics
        const [newsStats, eventsStats, userStats] = await Promise.all([
          newsService.getStats().catch(() => null),
          eventsService.getStats().catch(() => null),
          usersService.getStats().catch(() => null),
        ]);

        return {
          totalNews: newsStats?.overall.totalNews || 0,
          totalEvents: eventsStats?.overall.totalEvents || 0,
          publishedNews: newsStats?.overall.publishedNews || 0,
          publishedEvents: eventsStats?.overall.publishedEvents || 0,
          totalUsers: userStats?.totalUsers || 0,
          activeUsers: userStats?.activeUsers || 0,
          upcomingEvents: eventsStats?.overall.upcomingEvents || 0,
          totalViews: newsStats?.overall.totalViews || 0,
          totalParticipants: eventsStats?.overall.totalParticipants || 0,
        };
      } else {
        // Governorate user gets their governorate stats
        const governorateId = authService.getGovernorateId();
        
        if (!governorateId) {
          throw new Error('Governorate ID not found');
        }

        const [newsResponse, eventsResponse] = await Promise.all([
          newsService.getAll({ governorateId, limit: 1 }).catch(() => null),
          eventsService.getAll({ governorateId, limit: 1 }).catch(() => null),
        ]);

        return {
          totalNews: newsResponse?.pagination.total || 0,
          totalEvents: eventsResponse?.pagination.total || 0,
          publishedNews: 0, // Would need separate call
          publishedEvents: 0, // Would need separate call
        };
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalNews: 0,
        totalEvents: 0,
        publishedNews: 0,
        publishedEvents: 0,
      };
    }
  },

  /**
   * Get recent news for dashboard
   */
  getRecentNews: async (limit: number = 5): Promise<RecentNewsItem[]> => {
    try {
      const user = authService.getStoredUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const params: { limit: number; sortBy: string; sortOrder: 'desc'; governorateId?: string } = {
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      // Governorate users only see their own news
      if (!authService.isAdmin()) {
        const governorateId = authService.getGovernorateId();
        if (governorateId) {
          params.governorateId = governorateId;
        }
      }

      const response = await newsService.getAll(params);
      return response.data as unknown as RecentNewsItem[];
    } catch (error) {
      console.error('Error fetching recent news:', error);
      return [];
    }
  },

  /**
   * Get recent events for dashboard
   */
  getRecentEvents: async (limit: number = 5): Promise<RecentEventItem[]> => {
    try {
      const user = authService.getStoredUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const params: { limit: number; sortBy: string; sortOrder: 'desc'; governorateId?: string } = {
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      // Governorate users only see their own events
      if (!authService.isAdmin()) {
        const governorateId = authService.getGovernorateId();
        if (governorateId) {
          params.governorateId = governorateId;
        }
      }

      const response = await eventsService.getAll(params);
      return response.data as unknown as RecentEventItem[];
    } catch (error) {
      console.error('Error fetching recent events:', error);
      return [];
    }
  },

  /**
   * Get full admin dashboard data
   */
  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    if (!authService.isAdmin()) {
      throw new Error('Admin access required');
    }

    const [stats, newsStats, eventsStats, userStats, recentNews, recentEvents] = await Promise.all([
      dashboardService.getStats(),
      newsService.getStats().catch(() => ({ overall: { totalNews: 0, publishedNews: 0, featuredNews: 0, totalViews: 0 }, byGovernorate: [] })),
      eventsService.getStats().catch(() => ({ overall: { totalEvents: 0, publishedEvents: 0, featuredEvents: 0, upcomingEvents: 0, totalParticipants: 0 }, byGovernorate: [] })),
      usersService.getStats().catch(() => ({ totalUsers: 0, activeUsers: 0, inactiveUsers: 0, adminUsers: 0, governorateUsers: 0 })),
      dashboardService.getRecentNews(5),
      dashboardService.getRecentEvents(5),
    ]);

    return {
      stats,
      newsStats,
      eventsStats,
      userStats,
      recentNews,
      recentEvents,
    };
  },

  /**
   * Get governorate user dashboard data
   */
  getGovernorateDashboard: async (): Promise<GovernorateDashboardData> => {
    const user = authService.getStoredUser();
    const governorateId = authService.getGovernorateId();

    if (!user || !governorateId) {
      throw new Error('User not authenticated or governorate not assigned');
    }

    const [stats, recentNews, recentEvents, governorateInfo] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentNews(5),
      dashboardService.getRecentEvents(5),
      governoratesService.getById(governorateId).catch(() => null),
    ]);

    return {
      stats,
      recentNews,
      recentEvents,
      governorateInfo: governorateInfo ? {
        _id: governorateInfo._id,
        name: governorateInfo.name,
        arabicName: governorateInfo.arabicName,
        slug: governorateInfo.slug,
      } : {
        _id: governorateId,
        name: 'Unknown',
        arabicName: 'غير معروف',
        slug: 'unknown',
      },
    };
  },
};

export default dashboardService;
