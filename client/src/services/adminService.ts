/**
 * Admin API service for dashboard operations.
 *
 * Provides methods for user management, content moderation, and analytics.
 */
import { apiClient, getNoCacheConfig } from './api';
import type {
  DashboardStats,
  AdminUser,
  AdminUserUpdate,
  UserListResponse,
  PendingResource
} from '@/types';

// Dashboard Statistics
export const getStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get('/admin/stats', getNoCacheConfig());
  return response.data;
};

// User Management
export const getUsers = async (params: {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  is_admin?: boolean;
}): Promise<UserListResponse> => {
  const response = await apiClient.get('/admin/users', {
    params: { ...params, _t: Date.now() },
    headers: { 'Cache-Control': 'no-cache' }
  });
  return response.data;
};

export const getUser = async (userId: string): Promise<AdminUser> => {
  const response = await apiClient.get(`/admin/users/${userId}`, getNoCacheConfig());
  return response.data;
};

export const updateUser = async (
  userId: string,
  updates: AdminUserUpdate
): Promise<AdminUser> => {
  const response = await apiClient.put(`/admin/users/${userId}`, updates);
  return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/admin/users/${userId}`);
};

// Resource Moderation
export const getPendingResources = async (): Promise<PendingResource[]> => {
  const response = await apiClient.get('/admin/resources/pending', getNoCacheConfig());
  return response.data;
};

export const approveResource = async (resourceId: string): Promise<void> => {
  await apiClient.put(`/admin/resources/${resourceId}/approve`);
};

export const rejectResource = async (resourceId: string): Promise<void> => {
  await apiClient.put(`/admin/resources/${resourceId}/reject`);
};

// Forum Moderation
export const pinThread = async (threadId: string): Promise<void> => {
  await apiClient.put(`/admin/threads/${threadId}/pin`);
};

export const unpinThread = async (threadId: string): Promise<void> => {
  await apiClient.put(`/admin/threads/${threadId}/unpin`);
};

export const deleteThread = async (threadId: string): Promise<void> => {
  await apiClient.delete(`/admin/threads/${threadId}`);
};

export const deleteReply = async (replyId: string): Promise<void> => {
  await apiClient.delete(`/admin/replies/${replyId}`);
};

// Category Management
export const createCategory = async (params: {
  name: string;
  description?: string;
  display_order?: number;
}): Promise<{ id: string }> => {
  const response = await apiClient.post('/admin/categories', params);
  return response.data;
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  await apiClient.delete(`/admin/categories/${categoryId}`);
};
