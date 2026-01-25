/**
 * Registrations Service
 * Handles event registration API operations
 * Based on backend endpoints under /events
 */

import apiClient from './client';

// Response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message?: string;
}

// ============ Types ============

export interface MemberRegistration {
  _id: string;
  name: string;
  age: number;
  college: string;
  phoneNumber: string;
  anotherPhoneNumber?: string;
  nationalId: string;
  email: string;
  committee: 'HR' | 'SM' | 'OR' | 'PR';
  whyChooseCommittee: string;
  whereKnowAboutUs: string;
  governorate: string;
  eventId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegistrationData {
  name: string;
  age: number;
  college: string;
  phoneNumber: string;
  anotherPhoneNumber?: string;
  nationalId: string;
  email: string;
  committee: string;
  whyChooseCommittee: string;
  whereKnowAboutUs: string;
  governorate: string;
}

export interface RegistrationQueryParams {
  page?: number;
  limit?: number;
  committee?: string;
  governorate?: string;
  status?: 'pending' | 'approved' | 'rejected';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RegistrationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface RegistrationsByGovernorate {
  governorate: string;
  count: number;
  registrations: MemberRegistration[];
}

// ============ Service ============

class RegistrationsService {
  /**
   * Create a new member registration (public)
   */
  async create(data: CreateRegistrationData): Promise<ApiResponse<MemberRegistration>> {
    const response = await apiClient.post<ApiResponse<MemberRegistration>>(
      '/registrations',
      data
    );
    return response.data;
  }

  /**
   * Get registrations for a specific event
   * GET /events/:eventId/registrations
   */
  async getByEvent(eventId: string, params?: RegistrationQueryParams): Promise<PaginatedResponse<MemberRegistration>['data']> {
    const response = await apiClient.get<PaginatedResponse<MemberRegistration>>(
      `/events/${eventId}/registrations`, 
      { params }
    );
    return response.data.data;
  }

  /**
   * Get registration statistics for an event
   * GET /events/:eventId/registrations/stats
   */
  async getStatsByEvent(eventId: string): Promise<RegistrationStats> {
    const response = await apiClient.get<ApiResponse<RegistrationStats>>(
      `/events/${eventId}/registrations/stats`
    );
    return response.data.data;
  }

  /**
   * Update registration status
   * PATCH /events/registrations/:registrationId
   */
  async updateStatus(registrationId: string, status: 'approved' | 'rejected'): Promise<MemberRegistration> {
    const response = await apiClient.patch<ApiResponse<MemberRegistration>>(
      `/events/registrations/${registrationId}`,
      { status }
    );
    return response.data.data;
  }

  /**
   * Get all registrations grouped by governorate
   * GET /events/registrations/by-governorate
   */
  async getByGovernorate(params?: RegistrationQueryParams): Promise<RegistrationsByGovernorate[]> {
    const response = await apiClient.get<ApiResponse<RegistrationsByGovernorate[]>>(
      '/events/registrations/by-governorate',
      { params }
    );
    // Handle different response structures
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  }

  /**
   * Get all registrations (fetches by governorate and flattens)
   * This is a helper method for backwards compatibility
   */
  async getAll(params?: RegistrationQueryParams): Promise<ApiResponse<MemberRegistration[]>> {
    try {
      const byGovernorate = await this.getByGovernorate(params);
      
      // Safely flatten the registrations
      const allRegistrations = Array.isArray(byGovernorate) 
        ? byGovernorate.flatMap(g => g?.registrations || [])
        : [];
        
      return {
        success: true,
        data: allRegistrations,
        message: 'Registrations fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching registrations:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch registrations'
      };
    }
  }

  /**
   * Delete a registration
   * Note: Check if this endpoint exists in backend
   */
  async delete(registrationId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/events/registrations/${registrationId}`
    );
    return response.data;
  }
}

// Export singleton instance
export const registrationsService = new RegistrationsService();
