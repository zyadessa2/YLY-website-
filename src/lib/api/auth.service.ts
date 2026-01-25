/**
 * Auth Service - Secure Authentication API
 * Handles login, logout, profile, and token management
 */

import apiClient, { clearAuthData } from './client';

// =====================
// Type Definitions
// =====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'governorate_user';
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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  credentials: AuthTokens;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// =====================
// Security Helpers
// =====================

// Sanitize email input
const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim().slice(0, 254);
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validate JWT token format
const isValidToken = (token: string | null): boolean => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

// Sanitize user data for storage (remove sensitive fields)
const sanitizeUserForStorage = (user: User): User => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    governorateId: user.governorateId,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// =====================
// Auth Service
// =====================

export const authService = {
  /**
   * Login with email and password
   * @throws Error if validation fails or API returns error
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Security: Validate inputs
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    if (!isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }

    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const sanitizedCredentials = {
      email: sanitizeEmail(credentials.email),
      password: credentials.password,
    };

    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      sanitizedCredentials
    );

    // Security: Validate response structure
    if (!data.data?.credentials?.accessToken || !data.data?.user) {
      throw new Error('Invalid server response');
    }

    // Store tokens and user data securely
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.data.credentials.accessToken);
      localStorage.setItem('refreshToken', data.data.credentials.refreshToken);
      localStorage.setItem('user', JSON.stringify(sanitizeUserForStorage(data.data.user)));
    }

    return data.data;
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearAuthData();
    }
  },

  /**
   * Get current user profile from API
   */
  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/profile');
    
    if (typeof window !== 'undefined' && data.data) {
      localStorage.setItem('user', JSON.stringify(sanitizeUserForStorage(data.data)));
    }
    
    return data.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    return data.data;
  },

  /**
   * Check if user is authenticated (client-side only)
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('accessToken');
    return isValidToken(token);
  },

  /**
   * Get stored user data (client-side only)
   */
  getStoredUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr) as User;
      if (!user._id || !user.email || !user.role) {
        clearAuthData();
        return null;
      }
      return user;
    } catch {
      clearAuthData();
      return null;
    }
  },

  /**
   * Check if current user is admin
   */
  isAdmin: (): boolean => {
    const user = authService.getStoredUser();
    return user?.role === 'admin';
  },

  /**
   * Check if current user is governorate user
   */
  isGovernorateUser: (): boolean => {
    const user = authService.getStoredUser();
    return user?.role === 'governorate_user';
  },

  /**
   * Get current user's governorate ID
   */
  getGovernorateId: (): string | null => {
    const user = authService.getStoredUser();
    if (!user?.governorateId) return null;
    return typeof user.governorateId === 'object' 
      ? user.governorateId._id 
      : user.governorateId;
  },

  /**
   * Check if user has permission for an action
   */
  hasPermission: (requiredRole: 'admin' | 'governorate_user' | 'any'): boolean => {
    const user = authService.getStoredUser();
    if (!user || !user.isActive) return false;
    
    if (requiredRole === 'any') return true;
    if (requiredRole === 'admin') return user.role === 'admin';
    return user.role === requiredRole || user.role === 'admin';
  },

  /**
   * Check if user can access a specific governorate's data
   */
  canAccessGovernorate: (governorateId: string): boolean => {
    const user = authService.getStoredUser();
    if (!user || !user.isActive) return false;
    if (user.role === 'admin') return true;
    
    const userGovId = authService.getGovernorateId();
    return userGovId === governorateId;
  },
};

export default authService;
