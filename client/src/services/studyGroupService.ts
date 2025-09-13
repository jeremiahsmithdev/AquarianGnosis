import { apiService } from './api';
import type { StudyGroup, StudyGroupMember } from '@/types';

// Study Group endpoints
export const getStudyGroups = async (): Promise<StudyGroup[]> => {
  const response = await apiService.get('/study-groups');
  return response.data;
};

export const createStudyGroup = async (group: { 
  name: string; 
  description?: string;
  is_location_based?: boolean;
  max_members?: number;
  is_public?: boolean;
}): Promise<StudyGroup> => {
  const response = await apiService.post('/study-groups', group);
  return response.data;
};

export const getStudyGroup = async (groupId: string): Promise<StudyGroup> => {
  const response = await apiService.get(`/study-groups/${groupId}`);
  return response.data;
};

export const updateStudyGroup = async (groupId: string, group: { 
  name?: string; 
  description?: string;
  is_location_based?: boolean;
  max_members?: number;
  is_public?: boolean;
}): Promise<StudyGroup> => {
  const response = await apiService.put(`/study-groups/${groupId}`, group);
  return response.data;
};

export const deleteStudyGroup = async (groupId: string): Promise<void> => {
  await apiService.delete(`/study-groups/${groupId}`);
};

export const joinStudyGroup = async (groupId: string): Promise<StudyGroupMember> => {
  const response = await apiService.post(`/study-groups/${groupId}/join`, { group_id: groupId });
  return response.data;
};

export const getStudyGroupMembers = async (groupId: string): Promise<StudyGroupMember[]> => {
  const response = await apiService.get(`/study-groups/${groupId}/members`);
  return response.data;
};

export const updateStudyGroupMember = async (groupId: string, memberId: string, member: { 
  role?: string;
}): Promise<StudyGroupMember> => {
  const response = await apiService.put(`/study-groups/${groupId}/members/${memberId}`, member);
  return response.data;
};

export const removeStudyGroupMember = async (groupId: string, memberId: string): Promise<void> => {
  await apiService.delete(`/study-groups/${groupId}/members/${memberId}`);
};
