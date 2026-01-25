/**
 * Events API Service - Secure Event Management
 * Handles all event-related API operations
 */

import apiClient from './client';
import { authService } from './auth.service';
import type { ApiResponse, PaginationParams } from '@/types/api.types';

// =====================
// Types
// =====================

export interface EventGovernorate {
  _id: string;
  name: string;
  arabicName: string;
  slug: string;
  logo?: string;
}

export interface EventCreator {
  _id?: string;
  email: string;
  role: string;
}

export interface EventItem {
  _id: string;
  governorateId: EventGovernorate;
  title: string;
  arabicTitle: string;
  slug: string;
  description: string;
  arabicDescription: string;
  content: string;
  arabicContent: string;
  location: string;
  arabicLocation: string;
  eventDate: string;
  eventTime?: string;
  endDate?: string;
  endTime?: string;
  coverImage: string;
  contentImages?: string[];
  registrationEnabled: boolean;
  registrationDeadline?: string;
  maxParticipants?: number;
  currentParticipants: number;
  published: boolean;
  publishedAt?: string;
  featured: boolean;
  tags?: string[];
  arabicTags?: string[];
  contactEmail?: string;
  contactPhone?: string;
  requirements?: string;
  arabicRequirements?: string;
  metaTitle?: string;
  metaDescription?: string;
  isUpcoming: boolean;
  isRegistrationOpen: boolean;
  createdBy?: EventCreator;
  updatedBy?: EventCreator;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  governorateId: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  content: string;
  arabicContent: string;
  location: string;
  arabicLocation: string;
  eventDate: string;
  eventTime?: string;
  endDate?: string;
  endTime?: string;
  coverImage: string;
  contentImages?: string[];
  registrationEnabled?: boolean;
  registrationDeadline?: string;
  maxParticipants?: number;
  published?: boolean;
  publishedAt?: string | null;
  featured?: boolean;
  tags?: string[];
  arabicTags?: string[];
  contactEmail?: string;
  contactPhone?: string;
  requirements?: string;
  arabicRequirements?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export type UpdateEventData = Partial<CreateEventData>;

export interface EventFilterParams extends PaginationParams {
  governorateId?: string;
  published?: boolean;
  featured?: boolean;
  upcoming?: boolean;
  registrationEnabled?: boolean;
  search?: string;
  tags?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EventStats {
  overall: {
    totalEvents: number;
    publishedEvents: number;
    featuredEvents: number;
    upcomingEvents: number;
    totalParticipants: number;
  };
  byGovernorate: Array<{
    governorateId: string;
    governorateName: string;
    governorateArabicName: string;
    totalEvents: number;
    publishedEvents: number;
    totalParticipants: number;
  }>;
}

// Registration types
export interface EventRegistration {
  _id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: RegistrationStatus;
  registeredAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegistrationData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface RegistrationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
}

export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface RegistrationsByGovernorateParams {
  status?: RegistrationStatus;
}

export interface RegistrationWithEvent extends EventRegistration {
  event?: {
    _id: string;
    title: string;
    arabicTitle: string;
    slug: string;
    eventDate: string;
  };
}

export interface RegistrationsByGovernorate {
  governorateId: string;
  governorateName: string;
  governorateArabicName: string;
  registrations: RegistrationWithEvent[];
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
  };
}

export interface PaginatedEventsResponse {
  success: boolean;
  message: string;
  data: {
    data: EventItem[];
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

const sanitizeText = (text: string, maxLength: number = 10000): string => {
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

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const isValidPhone = (phone: string): boolean => {
  // Remove common formatting characters for validation
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Accept Egyptian phone formats:
  // 01xxxxxxxxx (11 digits starting with 01)
  // 1xxxxxxxxx (10 digits starting with 1)
  // +201xxxxxxxxx or 201xxxxxxxxx
  const egyptianPhone = /^(0?1[0125]\d{8}|(\+?20)1[0125]\d{8})$/;
  return egyptianPhone.test(cleaned);
};

const checkGovernorateAccess = (governorateId: string): void => {
  if (!authService.canAccessGovernorate(governorateId)) {
    throw new Error('You do not have permission to access this governorate\'s events');
  }
};

const validateEventData = (data: CreateEventData | UpdateEventData, isCreate: boolean = false): void => {
  if (isCreate) {
    const createData = data as CreateEventData;
    if (!createData.governorateId) throw new Error('Governorate ID is required');
    if (!createData.title) throw new Error('Title is required');
    if (!createData.arabicTitle) throw new Error('Arabic title is required');
    if (!createData.description) throw new Error('Description is required');
    if (!createData.eventDate) throw new Error('Event date is required');
    if (!createData.location) throw new Error('Location is required');
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
  
  if (data.contactEmail && !isValidEmail(data.contactEmail)) {
    throw new Error('Invalid contact email');
  }
};

// =====================
// Service
// =====================

export const eventsService = {
  /**
   * Get all events with pagination and filters
   */
  getAll: async (params?: EventFilterParams): Promise<PaginatedEventsResponse['data']> => {
    const { data } = await apiClient.get<PaginatedEventsResponse>('/events', { params });
    return data.data;
  },

  /**
   * Get event by ID
   */
  getById: async (id: string): Promise<EventItem> => {
    if (!id) throw new Error('Event ID is required');
    const { data } = await apiClient.get<ApiResponse<EventItem>>(`/events/${id}`);
    return data.data;
  },

  /**
   * Get event by slug (for public pages)
   */
  getBySlug: async (slug: string): Promise<EventItem> => {
    if (!slug) throw new Error('Slug is required');
    const { data } = await apiClient.get<ApiResponse<EventItem>>(`/events/slug/${slug}`);
    return data.data;
  },

  /**
   * Create new event
   */
  create: async (eventData: CreateEventData): Promise<EventItem> => {
    validateEventData(eventData, true);
    checkGovernorateAccess(eventData.governorateId);
    
    const sanitized: CreateEventData = {
      ...eventData,
      title: sanitizeText(eventData.title, 200),
      arabicTitle: sanitizeText(eventData.arabicTitle, 200),
      description: sanitizeText(eventData.description, 500),
      arabicDescription: sanitizeText(eventData.arabicDescription, 500),
      content: sanitizeText(eventData.content),
      arabicContent: sanitizeText(eventData.arabicContent),
      location: sanitizeText(eventData.location, 200),
      arabicLocation: sanitizeText(eventData.arabicLocation, 200),
    };
    
    const { data } = await apiClient.post<ApiResponse<EventItem>>('/events', sanitized);
    return data.data;
  },

  /**
   * Update event
   */
  update: async (id: string, eventData: UpdateEventData): Promise<EventItem> => {
    if (!id) throw new Error('Event ID is required');
    validateEventData(eventData, false);
    
    const existing = await eventsService.getById(id);
    checkGovernorateAccess(existing.governorateId._id);
    
    const { data } = await apiClient.patch<ApiResponse<EventItem>>(`/events/${id}`, eventData);
    return data.data;
  },

  /**
   * Delete event
   */
  delete: async (id: string): Promise<void> => {
    if (!id) throw new Error('Event ID is required');
    
    const existing = await eventsService.getById(id);
    checkGovernorateAccess(existing.governorateId._id);
    
    await apiClient.delete(`/events/${id}`);
  },

  /**
   * Toggle featured status (Admin only)
   */
  toggleFeatured: async (id: string): Promise<EventItem> => {
    if (!authService.isAdmin()) {
      throw new Error('Admin access required');
    }
    const { data } = await apiClient.patch<ApiResponse<EventItem>>(`/events/${id}/toggle-featured`);
    return data.data;
  },

  /**
   * Toggle published status (Admin only)
   */
  togglePublished: async (id: string): Promise<EventItem> => {
    if (!authService.isAdmin()) {
      throw new Error('Admin access required');
    }
    const { data } = await apiClient.patch<ApiResponse<EventItem>>(`/events/${id}/toggle-published`);
    return data.data;
  },

  /**
   * Toggle registration status
   */
  toggleRegistration: async (id: string): Promise<EventItem> => {
    const existing = await eventsService.getById(id);
    checkGovernorateAccess(existing.governorateId._id);
    
    const { data } = await apiClient.patch<ApiResponse<EventItem>>(`/events/${id}/toggle-registration`);
    return data.data;
  },

  /**
   * Get featured events (public)
   */
  getFeatured: async (governorateId?: string, limit: number = 5): Promise<EventItem[]> => {
    const params: EventFilterParams = { featured: true, published: true, limit };
    if (governorateId) params.governorateId = governorateId;
    
    const { data } = await apiClient.get<ApiResponse<EventItem[]>>('/events/featured', { params });
    return data.data;
  },

  /**
   * Get upcoming events (public)
   */
  getUpcoming: async (governorateId?: string, limit: number = 10): Promise<EventItem[]> => {
    const params: EventFilterParams = { upcoming: true, published: true, limit };
    if (governorateId) params.governorateId = governorateId;
    
    const { data } = await apiClient.get<ApiResponse<EventItem[]>>('/events/upcoming', { params });
    return data.data;
  },

  /**
   * Get event statistics (Admin only)
   */
  getStats: async (): Promise<EventStats> => {
    if (!authService.isAdmin()) {
      throw new Error('Admin access required');
    }
    const { data } = await apiClient.get<ApiResponse<EventStats>>('/events/stats');
    return data.data;
  },

  /**
   * Get events by governorate
   */
  getByGovernorate: async (governorateId: string, params?: EventFilterParams): Promise<PaginatedEventsResponse['data']> => {
    return eventsService.getAll({ ...params, governorateId });
  },

  /**
   * Get published events only (for public pages)
   */
  getPublished: async (params?: EventFilterParams): Promise<PaginatedEventsResponse['data']> => {
    return eventsService.getAll({ ...params, published: true });
  },

  // =====================
  // Registration Methods
  // =====================

  /**
   * Register for an event (public)
   */
  register: async (eventId: string, registrationData: CreateRegistrationData): Promise<EventRegistration> => {
    if (!eventId) throw new Error('Event ID is required');
    if (!registrationData.name) throw new Error('Name is required');
    if (!registrationData.email || !isValidEmail(registrationData.email)) {
      throw new Error('Valid email is required');
    }
    if (!registrationData.phone || !isValidPhone(registrationData.phone)) {
      throw new Error('Valid phone number is required');
    }
    
    const sanitized: CreateRegistrationData = {
      name: sanitizeText(registrationData.name, 100),
      email: registrationData.email.toLowerCase().trim(),
      // Remove leading zero from Egyptian phone numbers before sending to backend
      phone: registrationData.phone.trim().replace(/^0/, ''),
      notes: registrationData.notes ? sanitizeText(registrationData.notes, 500) : undefined,
    };
    
    const { data } = await apiClient.post<ApiResponse<EventRegistration>>(
      `/events/${eventId}/register`,
      sanitized
    );
    return data.data;
  },

  /**
   * Cancel registration (public)
   */
  cancelRegistration: async (eventId: string, email: string): Promise<void> => {
    if (!eventId) throw new Error('Event ID is required');
    if (!email || !isValidEmail(email)) {
      throw new Error('Valid email is required');
    }
    
    await apiClient.delete(`/events/${eventId}/register`, {
      data: { email: email.toLowerCase().trim() },
    });
  },

  /**
   * Get event registrations (requires governorate access)
   */
  getRegistrations: async (eventId: string, status?: string): Promise<EventRegistration[]> => {
    if (!eventId) throw new Error('Event ID is required');
    
    const existing = await eventsService.getById(eventId);
    checkGovernorateAccess(existing.governorateId._id);
    
    const params = status ? { status } : undefined;
    const { data } = await apiClient.get<ApiResponse<EventRegistration[]>>(
      `/events/${eventId}/registrations`,
      { params }
    );
    return data.data;
  },

  /**
   * Update registration status (requires governorate access)
   */
  updateRegistrationStatus: async (
    registrationId: string, 
    status: RegistrationStatus
  ): Promise<EventRegistration> => {
    if (!registrationId) throw new Error('Registration ID is required');
    if (!['pending', 'approved', 'rejected', 'cancelled'].includes(status)) {
      throw new Error('Invalid status. Must be: pending, approved, rejected, or cancelled');
    }
    
    const { data } = await apiClient.patch<ApiResponse<EventRegistration>>(
      `/events/registrations/${registrationId}`,
      { status }
    );
    return data.data;
  },

  /**
   * Get all registrations grouped by governorate (Admin/Governorate User)
   * Admin: sees all governorates
   * Governorate User: sees only their governorate
   */
  getRegistrationsByGovernorate: async (
    params?: RegistrationsByGovernorateParams
  ): Promise<RegistrationsByGovernorate[]> => {
    const { data } = await apiClient.get<ApiResponse<RegistrationsByGovernorate[]>>(
      '/events/registrations/by-governorate',
      { params }
    );
    return data.data;
  },

  /**
   * Get registration statistics (requires governorate access)
   */
  getRegistrationStats: async (eventId: string): Promise<RegistrationStats> => {
    if (!eventId) throw new Error('Event ID is required');
    
    const existing = await eventsService.getById(eventId);
    checkGovernorateAccess(existing.governorateId._id);
    
    const { data } = await apiClient.get<ApiResponse<RegistrationStats>>(
      `/events/${eventId}/registrations/stats`
    );
    return data.data;
  },
};

export default eventsService;
