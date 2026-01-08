import { apiClient } from './api';
import type { ForumCategory, ForumThread, ForumReply } from '@/types';

// Category endpoints
export const getCategories = async (): Promise<ForumCategory[]> => {
  const response = await apiClient.get('/forum/categories');
  return response.data;
};

export const createCategory = async (category: { name: string; description?: string }): Promise<ForumCategory> => {
  const response = await apiClient.post('/forum/categories', category);
  return response.data;
};

export const updateCategory = async (id: string, category: { name?: string; description?: string }): Promise<ForumCategory> => {
  const response = await apiClient.put(`/forum/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/forum/categories/${id}`);
};

// Thread endpoints
export const getThreadsByCategory = async (categoryId: string): Promise<ForumThread[]> => {
  const response = await apiClient.get(`/forum/categories/${categoryId}/threads`);
  return response.data;
};

export const createThread = async (thread: { title: string; content: string; category_id: string }): Promise<ForumThread> => {
  const response = await apiClient.post('/forum/threads', thread);
  return response.data;
};

export const getThread = async (threadId: string): Promise<ForumThread> => {
  const response = await apiClient.get(`/forum/threads/${threadId}`);
  return response.data;
};

export const updateThread = async (id: string, thread: { title?: string; content?: string }): Promise<ForumThread> => {
  const response = await apiClient.put(`/forum/threads/${id}`, thread);
  return response.data;
};

export const deleteThread = async (id: string): Promise<void> => {
  await apiClient.delete(`/forum/threads/${id}`);
};

// Reply endpoints
export const getRepliesByThread = async (threadId: string): Promise<ForumReply[]> => {
  const response = await apiClient.get(`/forum/threads/${threadId}/replies`);
  return response.data;
};

export const createReply = async (reply: { content: string; thread_id: string; parent_reply_id?: string }): Promise<ForumReply> => {
  const response = await apiClient.post('/forum/replies', reply);
  return response.data;
};

export const updateReply = async (id: string, reply: { content?: string }): Promise<ForumReply> => {
  const response = await apiClient.put(`/forum/replies/${id}`, reply);
  return response.data;
};

export const deleteReply = async (id: string): Promise<void> => {
  await apiClient.delete(`/forum/replies/${id}`);
};

// Voting endpoints
export const voteThread = async (threadId: string, voteType: 'up' | 'down'): Promise<{ upvotes: number; downvotes: number }> => {
  const response = await apiClient.post(`/forum/threads/${threadId}/vote`, { vote_type: voteType });
  return response.data;
};

export const voteReply = async (replyId: string, voteType: 'up' | 'down'): Promise<{ upvotes: number; downvotes: number }> => {
  const response = await apiClient.post(`/forum/replies/${replyId}/vote`, { vote_type: voteType });
  return response.data;
};
