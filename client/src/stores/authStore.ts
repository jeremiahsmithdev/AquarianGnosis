import { create } from 'zustand';
import { apiService } from '../services/api';
import { identifyUser, resetUser, trackEvent, AnalyticsEvents } from '../services/analytics';
import type { User, LoginRequest, RegisterRequest } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registrationSuccess: boolean;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  clearRegistrationSuccess: () => void;
}

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    registrationSuccess: false,

    login: async (credentials: LoginRequest) => {
      set({ isLoading: true, error: null });

      try {
        await apiService.login(credentials);
        const user = await apiService.getCurrentUser();

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Identify user in analytics
        identifyUser(user);
        trackEvent(AnalyticsEvents.USER_LOGGED_IN);
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || error.message || 'Login failed';
        set({
          error: errorMessage,
          isLoading: false,
          isAuthenticated: false,
          user: null
        });
        throw error;
      }
    },

    register: async (userData: RegisterRequest) => {
      set({ isLoading: true, error: null, registrationSuccess: false });

      try {
        const user = await apiService.register(userData);
        // Note: User needs to login after registration in MVP
        set({
          isLoading: false,
          error: null,
          registrationSuccess: true
        });

        // Track registration event
        trackEvent(AnalyticsEvents.USER_SIGNED_UP);
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || error.message || 'Registration failed';
        set({
          error: errorMessage,
          isLoading: false,
          registrationSuccess: false
        });
        throw error;
      }
    },

    logout: () => {
      // Track logout event before resetting
      trackEvent(AnalyticsEvents.USER_LOGGED_OUT);
      resetUser();

      apiService.logout();
      set({
        user: null,
        isAuthenticated: false,
        error: null
      });
    },

    getCurrentUser: async () => {
      if (!apiService.isAuthenticated()) {
        set({ isAuthenticated: false, user: null });
        return;
      }

      set({ isLoading: true });
      
      try {
        const user = await apiService.getCurrentUser();
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Re-identify user on session restore
        identifyUser(user);
      } catch (error: any) {
        // Token might be expired or invalid
        apiService.logout();
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false,
          error: null 
        });
      }
    },

    clearError: () => set({ error: null }),

    setLoading: (loading: boolean) => set({ isLoading: loading }),

    clearRegistrationSuccess: () => set({ registrationSuccess: false }),
  })
);
