import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigationStore } from '../stores/navigationStore';
import { getStudyGroups, createStudyGroup, joinStudyGroup } from '../services/studyGroupService';
import type { StudyGroup } from '@/types';

export const StudyGroupPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { setIsNavigating } = useNavigationStore();
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [showGroupForm, setShowGroupForm] = useState(false);

  useEffect(() => {
    loadStudyGroups();
  }, []);

  const loadStudyGroups = async () => {
    try {
      setLoading(true);
      const data = await getStudyGroups();
      setStudyGroups(data);
      setError(null);
    } catch (err) {
      setError('Failed to load study groups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      const newGroup = await createStudyGroup({
        name: newGroupName,
        description: newGroupDescription
      });
      setStudyGroups([...studyGroups, newGroup]);
      setNewGroupName('');
      setNewGroupDescription('');
      setShowGroupForm(false);
    } catch (err) {
      setError('Failed to create study group');
      console.error(err);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const member = await joinStudyGroup(groupId);
      // Update the group with the new member count
      const updatedGroups = studyGroups.map(group => 
        group.id === groupId 
          ? { ...group, members: [...(group.members || []), member] } 
          : group
      );
      setStudyGroups(updatedGroups);
    } catch (err) {
      setError('Failed to join study group');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="study-group-page">
        <div className="page-header">
          <h1>Study Groups</h1>
          <button onClick={() => onNavigate('landing')} className="back-button">
            Back to Home
          </button>
        </div>
        <div className="loading">Loading study groups...</div>
      </div>
    );
  }

  return (
    <div className="study-group-page">
      <div className="page-header">
        <h1>Study Groups</h1>
        <button onClick={() => onNavigate('landing')} className="back-button">
          Back to Home
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="study-groups-content">
        <div className="section-header">
          <h2>Available Study Groups</h2>
          {isAuthenticated && (
            <button 
              onClick={() => setShowGroupForm(!showGroupForm)}
              className="create-group-button"
            >
              {showGroupForm ? 'Cancel' : 'Create Study Group'}
            </button>
          )}
        </div>

        {showGroupForm && (
          <div className="group-form">
            <h3>Create New Study Group</h3>
            <input
              type="text"
              placeholder="Study group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="group-input"
            />
            <textarea
              placeholder="Study group description"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              className="group-textarea"
            />
            <button onClick={handleCreateGroup} className="submit-button">
              Create Study Group
            </button>
          </div>
        )}

        <div className="study-groups-list">
          {studyGroups.map(group => (
            <div key={group.id} className="study-group-item">
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <div className="group-stats">
                <span>{group.members?.length || 0} members</span>
                <span>Max: {group.max_members} members</span>
                <span>{group.is_public ? 'Public' : 'Private'}</span>
              </div>
              {isAuthenticated && (
                <button 
                  onClick={() => handleJoinGroup(group.id)}
                  className="join-button"
                >
                  Join Group
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
