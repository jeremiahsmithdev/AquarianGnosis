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
// Forum Types
interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  created_at: string;
  threads?: ForumThread[];
}

interface ForumThread {
  id: string;
  category_id: string;
  author_id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  replies?: ForumReply[];
}

interface ForumReply {
  id: string;
  thread_id: string;
  author_id: string;
  content: string;
  parent_reply_id?: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
}

interface ForumCategoryRequest {
  name: string;
  description?: string;
  display_order?: number;
}

interface ForumThreadRequest {
  title: string;
  content: string;
  category_id: string;
  is_pinned?: boolean;
}

interface ForumReplyRequest {
  content: string;
  thread_id: string;
  parent_reply_id?: string;
}

// Export forum types using type-only syntax
export type { ForumCategory, ForumThread, ForumReply };
export type { ForumCategoryRequest, ForumThreadRequest, ForumReplyRequest };

// Study Group Types
interface StudyGroup {
  id: string;
  name: string;
  description?: string;
  creator_id: string;
  is_location_based: boolean;
  max_members: number;
  is_public: boolean;
  created_at: string;
  members?: StudyGroupMember[];
}

interface StudyGroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'member' | 'moderator' | 'admin';
  joined_at: string;
}

interface StudyGroupRequest {
  name: string;
  description?: string;
  is_location_based?: boolean;
  max_members?: number;
  is_public?: boolean;
}

interface StudyGroupMemberRequest {
  group_id: string;
  role?: 'member' | 'moderator' | 'admin';
}

// Export study group types using type-only syntax
export type { StudyGroup, StudyGroupMember, StudyGroupRequest, StudyGroupMemberRequest };

// Shared Resource Types
interface SharedResource {
  id: string;
  title: string;
  url?: string;
  description?: string;
  resource_type: string;
  submitted_by: string;
  upvotes: number;
  downvotes: number;
  is_approved: boolean;
  created_at: string;
}

interface SharedResourceRequest {
  title: string;
  url?: string;
  description?: string;
  resource_type: string;
  is_approved?: boolean;
}

// Export shared resource types using type-only syntax
export type { SharedResource, SharedResourceRequest };
