/**
 * News API Service - Secure News Management
 * Handles all news-related API operations
 */

import apiClient from './client';
import { authService } from './auth.service';
import type { ApiResponse, PaginationParams } from '@/types/api.types';

// =====================
// Types
// =====================

export interface NewsGovernorate {
  _id: string;
  name: string;
  arabicName: string;
  slug: string;
  logo?: string;
}

export interface NewsCreator {
  _id?: string;
  email: string;
  role: string;
}

export interface NewsItem {
  _id: string;
  governorateId: NewsGovernorate;
  title: string;
  arabicTitle: string;
  slug: string;
  description: string;
  arabicDescription: string;
  content: string;
  arabicContent: string;
  author: string;
  arabicAuthor: string;
  coverImage: string;
  contentImages?: string[];
  published: boolean;
  publishedAt?: string;
  featured: boolean;
  viewCount: number;
  tags?: string[];
  arabicTags?: string[];
  metaTitle?: string;
  arabicMetaTitle?: string;
  metaDescription?: string;
  arabicMetaDescription?: string;
  createdBy?: NewsCreator;
  updatedBy?: NewsCreator;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsData {
  governorateId: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  content: string;
  arabicContent: string;
  author: string;
  arabicAuthor: string;
  coverImage: string;
  contentImages?: string[];
  published?: boolean;
  publishedAt?: string | null;
  featured?: boolean;
  tags?: string[];
  arabicTags?: string[];
  metaTitle?: string;
  arabicMetaTitle?: string;
  metaDescription?: string;
  arabicMetaDescription?: string;
}

export type UpdateNewsData = Partial<CreateNewsData>;

export interface NewsFilterParams extends PaginationParams {
  governorateId?: string;
  published?: boolean;
  featured?: boolean;
  search?: string;
  tags?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface NewsStats {
  overall: {
    totalNews: number;
    publishedNews: number;
    featuredNews: number;
    totalViews: number;
  };
  byGovernorate: Array<{
    governorateId: string;
    governorateName: string;
    governorateArabicName: string;
    totalNews: number;
    publishedNews: number;
    totalViews: number;
  }>;
}

export interface PaginatedNewsResponse {
  success: boolean;
  message: string;
  data: {
    data: NewsItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// =====================
// Security Helpers
// =====================

// Sanitize text input
const sanitizeText = (text: string, maxLength: number = 10000): string => {
  return text.trim().slice(0, maxLength);
};

// Validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Check governorate access permission
const checkGovernorateAccess = (governorateId: string): void => {
  if (!authService.canAccessGovernorate(governorateId)) {
    throw new Error('You do not have permission to access this governorate\'s news');
  }
};

// Validate create/update data
const validateNewsData = (data: CreateNewsData | UpdateNewsData, isCreate: boolean = false): void => {
  if (isCreate) {
    const createData = data as CreateNewsData;
    if (!createData.governorateId) throw new Error('Governorate ID is required');
    if (!createData.title) throw new Error('Title is required');
    if (!createData.arabicTitle) throw new Error('Arabic title is required');
    if (!createData.description) throw new Error('Description is required');
    if (!createData.content) throw new Error('Content is required');
    if (!createData.coverImage) throw new Error('Cover image is required');
  }
  
  if (data.coverImage && !isValidUrl(data.coverImage)) {
    throw new Error('Invalid cover image URL');
  }
  
  if (data.contentImages) {
    for (const img of data.contentImages) {
      if (!isValidUrl(img)) {
        throw new Error('Invalid content image URL');
      }
    }
  }
};

// =====================
// Service
// =====================

export const newsService = {
  /**
   * Get all news with pagination and filters
   */
  getAll: async (params?: NewsFilterParams): Promise<PaginatedNewsResponse['data']> => {
    const { data } = await apiClient.get<PaginatedNewsResponse>('/news', { params });
    return data.data;
  },

  /**
   * Get news by ID
   */
  getById: async (id: string): Promise<NewsItem> => {
    if (!id) throw new Error('News ID is required');
    const { data } = await apiClient.get<ApiResponse<NewsItem>>(`/news/${id}`);
    return data.data;
  },

  /**
   * Get news by slug (for public pages)
   */
  getBySlug: async (slug: string): Promise<NewsItem> => {
    if (!slug) throw new Error('Slug is required');
    const { data } = await apiClient.get<ApiResponse<NewsItem>>(`/news/slug/${slug}`);
    return data.data;
  },

  /**
   * Create new news article
   */
  create: async (newsData: CreateNewsData): Promise<NewsItem> => {
    validateNewsData(newsData, true);
    checkGovernorateAccess(newsData.governorateId);
    
    const sanitized: CreateNewsData = {
      ...newsData,
      title: sanitizeText(newsData.title, 200),
      arabicTitle: sanitizeText(newsData.arabicTitle, 200),
      description: sanitizeText(newsData.description, 500),
      arabicDescription: sanitizeText(newsData.arabicDescription, 500),
      content: sanitizeText(newsData.content),
      arabicContent: sanitizeText(newsData.arabicContent),
      author: sanitizeText(newsData.author, 100),
      arabicAuthor: sanitizeText(newsData.arabicAuthor, 100),
    };
    
    const { data } = await apiClient.post<ApiResponse<NewsItem>>('/news', sanitized);
    return data.data;
  },

  /**
   * Update news article
   */
  update: async (id: string, newsData: UpdateNewsData): Promise<NewsItem> => {
    if (!id) throw new Error('News ID is required');
    validateNewsData(newsData, false);
    
    // Get existing news to check governorate access
    const existing = await newsService.getById(id);
    checkGovernorateAccess(existing.governorateId._id);
    
    const { data } = await apiClient.patch<ApiResponse<NewsItem>>(`/news/${id}`, newsData);
    return data.data;
  },

  /**
   * Delete news article
   */
  delete: async (id: string): Promise<void> => {
    if (!id) throw new Error('News ID is required');
    
    // Get existing news to check governorate access
    const existing = await newsService.getById(id);
    checkGovernorateAccess(existing.governorateId._id);
    
    await apiClient.delete(`/news/${id}`);
  },

  /**
   * Toggle featured status (Admin only)
   */
  toggleFeatured: async (id: string): Promise<NewsItem> => {
    if (!authService.isAdmin()) {
      throw new Error('Admin access required');
    }
    const { data } = await apiClient.patch<ApiResponse<NewsItem>>(`/news/${id}/toggle-featured`);
    return data.data;
  },

  /**
   * Toggle published status (Admin only)
   */
  togglePublished: async (id: string): Promise<NewsItem> => {
    if (!authService.isAdmin()) {
      throw new Error('Admin access required');
    }
    const { data } = await apiClient.patch<ApiResponse<NewsItem>>(`/news/${id}/toggle-published`);
    return data.data;
  },

  /**
   * Increment view count (public)
   */
  incrementView: async (id: string): Promise<void> => {
    if (!id) return;
    await apiClient.patch(`/news/${id}/view`);
  },

  /**
   * Get featured news (public)
   */
  getFeatured: async (governorateId?: string, limit: number = 5): Promise<NewsItem[]> => {
    const params: NewsFilterParams = { featured: true, published: true, limit };
    if (governorateId) params.governorateId = governorateId;
    
    const { data } = await apiClient.get<ApiResponse<NewsItem[]>>('/news/featured', { params });
    return data.data;
  },

  /**
   * Get related news
   */
  getRelated: async (id: string, limit: number = 5): Promise<NewsItem[]> => {
    if (!id) return [];
    const { data } = await apiClient.get<ApiResponse<NewsItem[]>>(`/news/${id}/related`, {
      params: { limit },
    });
    return data.data;
  },

  /**
   * Get news statistics (Admin only)
   */
  getStats: async (): Promise<NewsStats> => {
    if (!authService.isAdmin()) {
      throw new Error('Admin access required');
    }
    const { data } = await apiClient.get<ApiResponse<NewsStats>>('/news/stats');
    return data.data;
  },

  /**
   * Get news by governorate
   */
  getByGovernorate: async (governorateId: string, params?: NewsFilterParams): Promise<PaginatedNewsResponse['data']> => {
    return newsService.getAll({ ...params, governorateId });
  },

  /**
   * Get published news only (for public pages)
   */
  getPublished: async (params?: NewsFilterParams): Promise<PaginatedNewsResponse['data']> => {
    return newsService.getAll({ ...params, published: true });
  },
};

export default newsService;
