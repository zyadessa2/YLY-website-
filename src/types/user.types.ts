/**
 * User Types - Types for user management
 */

import type { BaseEntity } from './api.types';

// =====================
// User Role Types
// =====================

export type UserRole = 'admin' | 'governorate_user';

// =====================
// User Types
// =====================

export interface User extends BaseEntity {
  email: string;
  role: UserRole;
  governorateId?: string | null;
  isActive: boolean;
  lastLogin?: string;
}

export interface UserWithGovernorate extends User {
  governorate?: {
    _id: string;
    name: {
      ar: string;
      en: string;
    };
    slug: string;
  };
}

// =====================
// Auth Types
// =====================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  credentials: AuthTokens;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// =====================
// User Management Types
// =====================

export interface CreateUserData {
  email: string;
  password: string;
  role: UserRole;
  governorateId?: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  role?: UserRole;
  governorateId?: string | null;
  isActive?: boolean;
}

// =====================
// User Filter Types
// =====================

export interface UserFilterParams {
  role?: UserRole;
  isActive?: boolean;
  governorateId?: string;
  search?: string;
}

// =====================
// Permission Helpers
// =====================

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

export function isGovernorateUser(user: User | null): boolean {
  return user?.role === 'governorate_user';
}

export function canAccessGovernorate(user: User | null, governorateId: string): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.role === 'governorate_user' && user.governorateId === governorateId;
}

export function canManageUsers(user: User | null): boolean {
  return user?.role === 'admin';
}

export function canManageAllContent(user: User | null): boolean {
  return user?.role === 'admin';
}
