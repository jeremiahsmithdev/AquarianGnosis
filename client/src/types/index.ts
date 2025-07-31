// Centralized types for Aquarian Gnosis

// User and Authentication Types
interface User {
  id: string;
  username: string;
  email: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Export all authentication types using type-only syntax (required for isolatedModules: true)
export type { User, LoginRequest, RegisterRequest, AuthResponse };

// Location Types
interface UserLocation {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  is_public: boolean;
  status: 'permanent' | 'traveling' | 'nomadic';
  created_at: string;
  updated_at: string;
}

interface LocationRequest {
  latitude: number;
  longitude: number;
  is_public: boolean;
  status: 'permanent' | 'traveling' | 'nomadic';
}

// Export location types using type-only syntax
export type { UserLocation, LocationRequest };

// Message Types
interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface MessageRequest {
  recipient_id: string;
  content: string;
}

// Export message types using type-only syntax
export type { Message, MessageRequest };

// Map Types
interface MapUser {
  id: string;
  username: string;
  latitude: number;
  longitude: number;
  status: 'permanent' | 'traveling' | 'nomadic';
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface MapStats {
  total_users: number;
  users_with_locations: number;
  public_locations: number;
  location_sharing_rate: number;
}

interface MapFilters {
  radius: number;
  status?: 'permanent' | 'traveling' | 'nomadic' | 'all';
  showOnlyPublic?: boolean;
}

interface GeolocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// Export map types using type-only syntax
export type { MapUser, MapStats, MapFilters, GeolocationCoords };

// API Error Type
interface ApiError {
  detail: string;
}

// Export API types using type-only syntax
export type { ApiError };