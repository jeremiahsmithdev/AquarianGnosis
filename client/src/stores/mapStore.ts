import { create } from 'zustand';
import { apiService } from '../services/api';
import type { UserLocation, MapStats, MapFilters, GeolocationCoords } from '@/types';
interface MapState {
  userLocation: UserLocation | null;
  nearbyLocations: UserLocation[];
  publicLocations: UserLocation[];
  mapStats: MapStats | null;
  currentPosition: GeolocationCoords | null;
  filters: MapFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentPosition: (position: GeolocationCoords) => void;
  setFilters: (filters: Partial<MapFilters>) => void;
  getUserLocation: () => Promise<void>;
  addUserLocation: (location: { latitude: number; longitude: number; is_public: boolean; status: string }) => Promise<void>;
  updateUserLocation: (updates: Partial<UserLocation>) => Promise<void>;
  deleteUserLocation: () => Promise<void>;
  getNearbyLocations: () => Promise<void>;
  getPublicLocations: () => Promise<void>;
  getMapStats: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useMapStore = create<MapState>()((set, get) => ({
  userLocation: null,
  nearbyLocations: [],
  publicLocations: [],
  mapStats: null,
  currentPosition: null,
  filters: {
    radius: 50,
    status: 'all',
    showOnlyPublic: false,
  },
  isLoading: false,
  error: null,

  setCurrentPosition: (position: GeolocationCoords) => {
    set({ currentPosition: position });
  },

  setFilters: (newFilters: Partial<MapFilters>) => {
    set({ filters: { ...get().filters, ...newFilters } });
  },

  getUserLocation: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const location = await apiService.getUserLocation();
      set({ userLocation: location, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to get user location', 
        isLoading: false,
        userLocation: null 
      });
    }
  },

  addUserLocation: async (locationData) => {
    set({ isLoading: true, error: null });
    
    try {
      const location = await apiService.addLocation(locationData);
      set({ userLocation: location, isLoading: false });
      
      // Refresh nearby locations if we have current position
      if (get().currentPosition) {
        get().getNearbyLocations();
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to add location', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateUserLocation: async (updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedLocation = await apiService.updateLocation(updates);
      set({ userLocation: updatedLocation, isLoading: false });
      
      // Refresh nearby locations
      if (get().currentPosition) {
        get().getNearbyLocations();
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to update location', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteUserLocation: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await apiService.deleteLocation();
      set({ userLocation: null, isLoading: false });
      
      // Clear nearby locations since user no longer has a location
      set({ nearbyLocations: [] });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to delete location', 
        isLoading: false 
      });
      throw error;
    }
  },

  getNearbyLocations: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { radius } = get().filters;
      const locations = await apiService.getNearbyLocations(radius);
      set({ nearbyLocations: locations, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to get nearby locations', 
        isLoading: false,
        nearbyLocations: []
      });
    }
  },

  getPublicLocations: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const locations = await apiService.getPublicLocations();
      set({ publicLocations: locations, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to get public locations', 
        isLoading: false,
        publicLocations: []
      });
    }
  },

  getMapStats: async () => {
    try {
      const stats = await apiService.getMapStats();
      set({ mapStats: stats });
    } catch (error: any) {
      // Don't set loading state for stats as it's not critical
      console.error('Failed to get map stats:', error);
    }
  },

  clearError: () => set({ error: null }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));