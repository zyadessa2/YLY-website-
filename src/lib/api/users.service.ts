/**
 * Users API Service - Secure User Management (Admin Only)
 * All operations require admin authentication
 */

import apiClient from './client';
import { authService } from './auth.service';
import type { ApiResponse, PaginationParams } from '@/types/api.types';

// =====================
// Types
// =====================

export type UserRole = 'admin' | 'governorate_user';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  governorateId?: {
    _id: string;
    name: string;
    arabicName: string;
    slug: string;
    logo?: string;
    coverImage?: string;
  } | string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  governorateUsers: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  governorateId?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  governorateId?: string | null;
  isActive?: boolean;
}

export interface UserFilterParams extends PaginationParams {
  role?: UserRole;
  isActive?: boolean;
  governorateId?: string;
  search?: string;
}

export interface PaginatedUsersResponse {
  success: boolean;
  message: string;
  data: {
    data: User[];
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

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validate password strength
const isValidPassword = (password: string): boolean => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Check admin permission before API call
const requireAdmin = (): void => {
  if (!authService.isAdmin()) {
    throw new Error('Admin access required');
  }
};

// Sanitize user input
const sanitizeCreateData = (data: CreateUserData): CreateUserData => {
  return {
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    password: data.password,
    role: data.role,
    governorateId: data.governorateId?.trim(),
  };
};

// =====================
// Service
// =====================

export const usersService = {
  /**
   * Get all users with pagination and filters (Admin only)
   */
  getAll: async (params?: UserFilterParams): Promise<PaginatedUsersResponse['data']> => {
    requireAdmin();
    const { data } = await apiClient.get<PaginatedUsersResponse>('/users', { params });
    return data.data;
  },

  /**
   * Get user by ID (Admin only)
   */
  getById: async (id: string): Promise<User> => {
    requireAdmin();
    if (!id || typeof id !== 'string') {
      throw new Error('Valid user ID required');
    }
    const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },

  /**
   * Create new user (Admin only)
   */
  create: async (userData: CreateUserData): Promise<User> => {
    requireAdmin();
    
    // Validate inputs
    if (!isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }
    
    if (!isValidPassword(userData.password)) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }
    
    if (!['admin', 'governorate_user'].includes(userData.role)) {
      throw new Error('Invalid role');
    }
    
    if (userData.role === 'governorate_user' && !userData.governorateId) {
      throw new Error('Governorate ID required for governorate users');
    }
    
    const sanitized = sanitizeCreateData(userData);
    const { data } = await apiClient.post<ApiResponse<User>>('/users', sanitized);
    return data.data;
  },

  /**
   * Update user (Admin only)
   */
  update: async (id: string, userData: UpdateUserData): Promise<User> => {
    requireAdmin();
    
    if (!id || typeof id !== 'string') {
      throw new Error('Valid user ID required');
    }
    
    // Validate email if provided
    if (userData.email && !isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }
    
    // Validate password if provided
    if (userData.password && !isValidPassword(userData.password)) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }

    // Validate role change: governorate_user requires governorateId
    if (userData.role === 'governorate_user' && userData.governorateId === null) {
      throw new Error('Governorate ID required for governorate users');
    }
    
    const { data } = await apiClient.patch<ApiResponse<User>>(`/users/${id}`, userData);
    return data.data;
  },

  /**
   * Delete user (Admin only)
   */
  delete: async (id: string): Promise<void> => {
    requireAdmin();
    
    if (!id || typeof id !== 'string') {
      throw new Error('Valid user ID required');
    }
    
    // Prevent self-deletion
    const currentUser = authService.getStoredUser();
    if (currentUser?._id === id) {
      throw new Error('Cannot delete your own account');
    }
    
    await apiClient.delete(`/users/${id}`);
  },

  /**
   * Toggle user status (Admin only)
   */
  toggleStatus: async (id: string): Promise<User> => {
    requireAdmin();
    
    if (!id || typeof id !== 'string') {
      throw new Error('Valid user ID required');
    }
    
    // Prevent toggling own status
    const currentUser = authService.getStoredUser();
    if (currentUser?._id === id) {
      throw new Error('Cannot change your own status');
    }
    
    const { data } = await apiClient.patch<ApiResponse<User>>(`/users/${id}/toggle-status`);
    return data.data;
  },

  /**
   * Reset user password (Admin only)
   */
  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    requireAdmin();
    
    if (!id || typeof id !== 'string') {
      throw new Error('Valid user ID required');
    }
    
    if (!isValidPassword(newPassword)) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }
    
    await apiClient.patch(`/users/${id}/reset-password`, { newPassword });
  },

  /**
   * Get user statistics (Admin only)
   */
  getStats: async (): Promise<UserStats> => {
    requireAdmin();
    const { data } = await apiClient.get<ApiResponse<UserStats>>('/users/stats');
    return data.data;
  },

  /**
   * Get users by governorate (Admin only)
   */
  getByGovernorate: async (governorateId: string): Promise<User[]> => {
    requireAdmin();
    const response = await usersService.getAll({ governorateId, limit: 100 });
    return response.data;
  },

  /**
   * Get admin users only (Admin only)
   */
  getAdmins: async (): Promise<User[]> => {
    requireAdmin();
    const response = await usersService.getAll({ role: 'admin', limit: 100 });
    return response.data;
  },

  /**
   * Get governorate users only (Admin only)
   */
  getGovernorateUsers: async (): Promise<User[]> => {
    requireAdmin();
    const response = await usersService.getAll({ role: 'governorate_user', limit: 100 });
    return response.data;
  },
};

export default usersService;
