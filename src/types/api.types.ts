/**
 * API Types - Shared types for API responses and pagination
 */

// =====================
// Generic API Response Types
// =====================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

// =====================
// Pagination Types
// =====================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
}

// =====================
// Filter Types
// =====================

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface StatusFilter {
  published?: boolean;
  featured?: boolean;
  isActive?: boolean;
}

// =====================
// Search Types
// =====================

export interface SearchParams extends PaginationParams {
  query?: string;
  fields?: string[]; // Fields to search in
}

// =====================
// Upload Types
// =====================

export interface UploadResponse {
  url: string;
  fileId: string;
  fileName: string;
  mimeType: string;
  size: number;
}

// =====================
// Common Entity Types
// =====================

export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalizedField {
  ar: string;
  en: string;
}

export interface LocalizedEntity extends BaseEntity {
  title: LocalizedField;
  description: LocalizedField;
  content?: LocalizedField;
}

// =====================
// Bilingual Field Helpers
// =====================

export type BilingualField<T> = {
  ar: T;
  en: T;
};

// Helper to get localized value
export function getLocalizedValue<T>(field: BilingualField<T>, locale: 'ar' | 'en'): T {
  return field[locale];
}

// Helper to create bilingual field
export function createBilingualField<T>(ar: T, en: T): BilingualField<T> {
  return { ar, en };
}
