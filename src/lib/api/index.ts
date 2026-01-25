/**
 * API Services Index
 * Central export for all API services
 */

// Client
export { default as apiClient, isAuthenticated, getStoredUser, clearAuthData } from './client';

// Services
export { authService } from './auth.service';
export { newsService } from './news.service';
export { eventsService } from './events.service';
export { governoratesService } from './governorates.service';
export { usersService } from './users.service';
export { registrationsService } from './registrations.service';
export { dashboardService } from './dashboard.service';

// Types re-exports
export type { LoginCredentials, User, AuthTokens, LoginResponse } from './auth.service';
export type { 
  NewsItem, 
  CreateNewsData, 
  UpdateNewsData, 
  NewsFilterParams,
  NewsStats,
  NewsGovernorate,
} from './news.service';
export type { 
  EventItem, 
  CreateEventData, 
  UpdateEventData, 
  EventFilterParams, 
  EventRegistration, 
  CreateRegistrationData,
  EventStats,
  RegistrationStats,
  RegistrationStatus,
  RegistrationsByGovernorateParams,
  RegistrationsByGovernorate,
  RegistrationWithEvent,
} from './events.service';
export type { 
  Governorate, 
  GovernorateDetails,
  GovernorateStats,
  GovernorateStatsAll,
  CreateGovernorateData, 
  UpdateGovernorateData,
  GovernorateFilterParams,
} from './governorates.service';
export type { 
  User as UserItem,
  UserStats,
  CreateUserData, 
  UpdateUserData,
  UserFilterParams,
  UserRole,
} from './users.service';
export type { 
  MemberRegistration, 
  CreateRegistrationData as CreateMemberRegistrationData, 
  RegistrationQueryParams,
} from './registrations.service';
export type { 
  DashboardStats, 
  RecentNewsItem, 
  RecentEventItem,
  AdminDashboardData,
  GovernorateDashboardData,
} from './dashboard.service';

