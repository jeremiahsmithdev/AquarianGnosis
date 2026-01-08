import { apiClient } from './api';
import type { SharedResource } from '@/types';

// Shared Resource endpoints
export const getResources = async (): Promise<SharedResource[]> => {
  const response = await apiClient.get('/resources');
  return response.data;
};

export const createResource = async (resource: { 
  title: string; 
  url?: string;
  description?: string;
  resource_type: string;
}): Promise<SharedResource> => {
  const response = await apiClient.post('/resources', resource);
  return response.data;
};

export const getResource = async (resourceId: string): Promise<SharedResource> => {
  const response = await apiClient.get(`/resources/${resourceId}`);
  return response.data;
};

export const updateResource = async (resourceId: string, resource: { 
  title?: string; 
  url?: string;
  description?: string;
  resource_type?: string;
  is_approved?: boolean;
}): Promise<SharedResource> => {
  const response = await apiClient.put(`/resources/${resourceId}`, resource);
  return response.data;
};

export const deleteResource = async (resourceId: string): Promise<void> => {
  await apiClient.delete(`/resources/${resourceId}`);
};

export const voteResource = async (resourceId: string, voteType: 'up' | 'down'): Promise<{ upvotes: number; downvotes: number }> => {
  const response = await apiClient.post(`/resources/${resourceId}/vote`, { vote_type: voteType });
  return response.data;
};
