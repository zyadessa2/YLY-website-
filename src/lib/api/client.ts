import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Security: Validate API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Security: Token validation helper
const isValidToken = (token: string | null): boolean => {
  if (!token || typeof token !== 'string') return false;
  // Basic JWT format check (header.payload.signature)
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

// Security: Sanitize token before use
const sanitizeToken = (token: string): string => {
  return token.trim().replace(/[<>]/g, '');
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
  // Security: Disable credentials for CORS by default
  withCredentials: false,
});

// Add interceptors for auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only access localStorage on client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && isValidToken(token)) {
        config.headers.Authorization = `Bearer ${sanitizeToken(token)}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Only access localStorage on client-side
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');

          if (!refreshToken || !isValidToken(refreshToken)) {
            throw new Error('No valid refresh token available');
          }

          const { data } = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken: sanitizeToken(refreshToken) },
            { timeout: 10000 } // Shorter timeout for refresh
          );

          // Security: Validate response before storing
          if (data?.data?.accessToken && isValidToken(data.data.accessToken)) {
            localStorage.setItem('accessToken', data.data.accessToken);

            // If a new refresh token is provided, store it too
            if (data.data.refreshToken && isValidToken(data.data.refreshToken)) {
              localStorage.setItem('refreshToken', data.data.refreshToken);
            }

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
            return apiClient(originalRequest);
          } else {
            throw new Error('Invalid token received');
          }
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login on refresh failure
        clearAuthData();
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - No permission
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
};

// Helper function to get stored user
export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Helper function to clear auth data
export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};
