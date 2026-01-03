import axios from 'axios';
import type { LoginRequest, RegisterRequest, User } from '@/types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API methods
const authApi = {
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post('/auth/login', credentials);
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    return response.data;
  },

  register: async (userData: RegisterRequest) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  }
};

// Map API methods
const mapApi = {
  getUserLocation: async () => {
    const response = await apiClient.get('/map/location');
    return response.data;
  },
  
  addLocation: async (locationData: {
    latitude: number;
    longitude: number;
    is_public: boolean;
    status: string;
    visibility_type?: 'public' | 'members' | 'custom';
    allowed_users?: string[];
  }) => {
    const response = await apiClient.post('/map/location', locationData);
    return response.data;
  },
  
  updateLocation: async (updates: Partial<{
    latitude: number;
    longitude: number;
    is_public: boolean;
    status: string;
    visibility_type: 'public' | 'members' | 'custom';
    allowed_users: string[];
  }>) => {
    const response = await apiClient.put('/map/location', updates);
    return response.data;
  },
  
  deleteLocation: async () => {
    const response = await apiClient.delete('/map/location');
    return response.data;
  },
  
  getNearbyLocations: async (radius: number, status?: string) => {
    const params = new URLSearchParams({ radius_km: radius.toString() });
    if (status && status !== 'all') {
      params.append('status', status);
    }
    const response = await apiClient.get(`/map/locations?${params.toString()}`);
    return response.data;
  },
  
  getPublicLocations: async () => {
    const response = await apiClient.get('/map/locations/public');
    return response.data;
  },
  
  getMapStats: async () => {
    const response = await apiClient.get('/map/stats');
    return response.data;
  }
};

// Create the combined API service by extending the axios instance
const apiService = Object.assign(apiClient, authApi, mapApi);

export { apiService };
