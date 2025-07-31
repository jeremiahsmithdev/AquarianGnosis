import { create } from 'zustand';
import { apiService } from '../services/api';
import type { User, LoginRequest, RegisterRequest } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

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
      } catch (error: any) {
        set({ 
          error: error.message || 'Login failed', 
          isLoading: false,
          isAuthenticated: false,
          user: null
        });
        throw error;
      }
    },

    register: async (userData: RegisterRequest) => {
      set({ isLoading: true, error: null });
      
      try {
        const user = await apiService.register(userData);
        // Note: User needs to login after registration in MVP
        set({ 
          isLoading: false,
          error: null 
        });
      } catch (error: any) {
        set({ 
          error: error.message || 'Registration failed', 
          isLoading: false 
        });
        throw error;
      }
    },

    logout: () => {
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
  })
);
