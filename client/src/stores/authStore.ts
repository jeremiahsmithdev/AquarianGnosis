import { create } from 'zustand';
import { apiService } from '../services/api';
import { identifyUser, resetUser, trackEvent, AnalyticsEvents } from '../services/analytics';
import { useNotificationStore } from './notificationStore';
import type { User, LoginRequest, RegisterRequest, TelegramAuthRequest } from '@/types';

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

  // Telegram actions
  loginWithTelegram: (telegramData: TelegramAuthRequest) => Promise<void>;
  linkTelegram: (telegramData: TelegramAuthRequest) => Promise<void>;
  unlinkTelegram: () => Promise<void>;
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

        // Show success notification
        useNotificationStore.getState().showNotification('success', `Welcome back, ${user.username}!`);
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

      // Show success notification
      useNotificationStore.getState().showNotification('success', 'You have been signed out successfully.');
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

    // Telegram authentication
    loginWithTelegram: async (telegramData: TelegramAuthRequest) => {
      set({ isLoading: true, error: null });

      try {
        await apiService.telegramAuth(telegramData);
        const user = await apiService.getCurrentUser();

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Identify user in analytics
        identifyUser(user);
        trackEvent(AnalyticsEvents.USER_LOGGED_IN, { method: 'telegram' });

        // Show success notification
        useNotificationStore.getState().showNotification(
          'success',
          `Welcome, ${user.username}!`
        );
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || error.message || 'Telegram login failed';
        set({
          error: errorMessage,
          isLoading: false,
          isAuthenticated: false,
          user: null
        });
        throw error;
      }
    },

    linkTelegram: async (telegramData: TelegramAuthRequest) => {
      set({ isLoading: true, error: null });

      try {
        const user = await apiService.telegramLink(telegramData);
        set({ user, isLoading: false });

        useNotificationStore.getState().showNotification(
          'success',
          'Telegram account linked successfully!'
        );
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || error.message || 'Failed to link Telegram';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    unlinkTelegram: async () => {
      set({ isLoading: true, error: null });

      try {
        const user = await apiService.telegramUnlink();
        set({ user, isLoading: false });

        useNotificationStore.getState().showNotification(
          'success',
          'Telegram account unlinked'
        );
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || error.message || 'Failed to unlink Telegram';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },
  })
);
