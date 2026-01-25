/**
 * Governorates API Service - Secure Governorate Management
 * Handles all governorate-related API operations
 */

import apiClient from './client';
import { authService } from './auth.service';
import type { ApiResponse, PaginationParams } from '@/types/api.types';

// =====================
// Types
// =====================

export interface Governorate {
  _id: string;
  name: string;
  arabicName: string;
  slug: string;
  description?: string;
  arabicDescription?: string;
  logo?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GovernorateDetails extends Governorate {
  statistics: {
    totalNews: number;
    publishedNews: number;
    totalEvents: number;
    publishedEvents: number;
    upcomingEvents: number;
    activeUsers: number;
  };
}

export interface GovernorateStats {
  governorate: {
    _id: string;
    name: string;
    arabicName: string;
    slug: string;
  };
  news: {
    total: number;
    published: number;
    featured: number;
    totalViews: number;
  };
  events: {
    total: number;
    published: number;
    upcoming: number;
    totalParticipants: number;
  };
  users: {
    total: number;
    active: number;
  };
  topNews: Array<{
    _id: string;
    title: string;
    arabicTitle: string;
    viewCount: number;
    slug: string;
    coverImage: string;
  }>;
  upcomingEvents: Array<{
    _id: string;
    title: string;
    arabicTitle: string;
    eventDate: string;
    location: string;
    slug: string;
  }>;
}

export interface GovernorateStatsAll {
  _id: string;
  name: string;
  arabicName: string;
  slug: string;
  totalNews: number;
  publishedNews: number;
  totalEvents: number;
  publishedEvents: number;
  upcomingEvents: number;
  activeUsers: number;
}

export interface CreateGovernorateData {
  name: string;
  arabicName: string;
  description?: string;
  arabicDescription?: string;
  logo?: string;
  coverImage?: string;
}

export type UpdateGovernorateData = Partial<CreateGovernorateData>;

export interface GovernorateFilterParams extends PaginationParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedGovernoratesResponse {
  success: boolean;
  message: string;
  data: {
    data: Governorate[];
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

const sanitizeText = (text: string, maxLength: number = 1000): string => {
  return text.trim().slice(0, maxLength);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const requireAdmin = (): void => {
  if (!authService.isAdmin()) {
    throw new Error('Admin access required');
  }
};

const validateGovernorateData = (data: CreateGovernorateData | UpdateGovernorateData, isCreate: boolean = false): void => {
  if (isCreate) {
    const createData = data as CreateGovernorateData;
    if (!createData.name) throw new Error('Name is required');
    if (!createData.arabicName) throw new Error('Arabic name is required');
  }
  
  if (data.logo && !isValidUrl(data.logo)) {
    throw new Error('Invalid logo URL');
  }
  
  if (data.coverImage && !isValidUrl(data.coverImage)) {
    throw new Error('Invalid cover image URL');
  }
};

// =====================
// Service
// =====================

export const governoratesService = {
  /**
   * Get all governorates with pagination
   */
  getAll: async (params?: GovernorateFilterParams): Promise<PaginatedGovernoratesResponse['data']> => {
    const { data } = await apiClient.get<PaginatedGovernoratesResponse>('/governorates', { params });
    return data.data;
  },

  /**
   * Get all governorates (no pagination - for dropdowns)
   */
  getAllSimple: async (): Promise<Governorate[]> => {
    const { data } = await apiClient.get<ApiResponse<Governorate[]>>('/governorates/all');
    return data.data;
  },

  /**
   * Get governorate by ID
   */
  getById: async (id: string): Promise<Governorate> => {
    if (!id) throw new Error('Governorate ID is required');
    const { data } = await apiClient.get<ApiResponse<Governorate>>(`/governorates/${id}`);
    return data.data;
  },

  /**
   * Get governorate by slug
   */
  getBySlug: async (slug: string): Promise<Governorate> => {
    if (!slug) throw new Error('Slug is required');
    const { data } = await apiClient.get<ApiResponse<Governorate>>(`/governorates/slug/${slug}`);
    return data.data;
  },

  /**
   * Get governorate details with statistics
   */
  getDetails: async (id: string): Promise<GovernorateDetails> => {
    if (!id) throw new Error('Governorate ID is required');
    const { data } = await apiClient.get<ApiResponse<GovernorateDetails>>(`/governorates/${id}/details`);
    return data.data;
  },

  /**
   * Create new governorate (Admin only)
   */
  create: async (governorateData: CreateGovernorateData): Promise<Governorate> => {
    requireAdmin();
    validateGovernorateData(governorateData, true);
    
    const sanitized: CreateGovernorateData = {
      name: sanitizeText(governorateData.name, 100),
      arabicName: sanitizeText(governorateData.arabicName, 100),
      description: governorateData.description ? sanitizeText(governorateData.description, 1000) : undefined,
      arabicDescription: governorateData.arabicDescription ? sanitizeText(governorateData.arabicDescription, 1000) : undefined,
      logo: governorateData.logo,
      coverImage: governorateData.coverImage,
    };
    
    const { data } = await apiClient.post<ApiResponse<Governorate>>('/governorates', sanitized);
    return data.data;
  },

  /**
   * Update governorate (Admin only)
   */
  update: async (id: string, governorateData: UpdateGovernorateData): Promise<Governorate> => {
    requireAdmin();
    if (!id) throw new Error('Governorate ID is required');
    validateGovernorateData(governorateData, false);
    
    const { data } = await apiClient.patch<ApiResponse<Governorate>>(`/governorates/${id}`, governorateData);
    return data.data;
  },

  /**
   * Delete governorate (Admin only)
   */
  delete: async (id: string): Promise<void> => {
    requireAdmin();
    if (!id) throw new Error('Governorate ID is required');
    
    await apiClient.delete(`/governorates/${id}`);
  },

  /**
   * Get governorate statistics
   */
  getStats: async (id: string): Promise<GovernorateStats> => {
    if (!id) throw new Error('Governorate ID is required');
    const { data } = await apiClient.get<ApiResponse<GovernorateStats>>(`/governorates/${id}/stats`);
    return data.data;
  },

  /**
   * Get all governorates statistics (Admin only)
   */
  getAllStats: async (): Promise<GovernorateStatsAll[]> => {
    requireAdmin();
    const { data } = await apiClient.get<ApiResponse<GovernorateStatsAll[]>>('/governorates/stats/all');
    return data.data;
  },

  /**
   * Get news for a governorate (Public)
   */
  getNews: async (id: string, params?: {
    page?: number;
    limit?: number;
    published?: boolean;
  }): Promise<{
    data: Array<{
      _id: string;
      title: string;
      arabicTitle: string;
      slug: string;
      description: string;
      arabicDescription: string;
      coverImage: string;
      published: boolean;
      publishedAt?: string;
      viewCount: number;
      tags?: string[];
      arabicTags?: string[];
      createdBy?: { email: string };
      createdAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> => {
    if (!id) throw new Error('Governorate ID is required');
    const { data } = await apiClient.get(`/governorates/${id}/news`, { params });
    return data.data;
  },

  /**
   * Get events for a governorate (Public)
   */
  getEvents: async (id: string, params?: {
    page?: number;
    limit?: number;
    published?: boolean;
    upcoming?: boolean;
  }): Promise<{
    data: Array<{
      _id: string;
      title: string;
      arabicTitle: string;
      slug: string;
      description: string;
      arabicDescription: string;
      coverImage: string;
      eventDate: string;
      eventTime?: string;
      location: string;
      arabicLocation: string;
      published: boolean;
      registrationEnabled?: boolean;
      currentParticipants?: number;
      maxParticipants?: number;
      isUpcoming?: boolean;
      isRegistrationOpen?: boolean;
      createdAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> => {
    if (!id) throw new Error('Governorate ID is required');
    const { data } = await apiClient.get(`/governorates/${id}/events`, { params });
    return data.data;
  },
};

export default governoratesService;
