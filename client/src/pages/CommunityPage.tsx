import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigationStore } from '../stores/navigationStore';
import { getCategories, createCategory, createThread } from '../services/forumService';
import { getStudyGroups, createStudyGroup, joinStudyGroup } from '../services/studyGroupService';
import type { ForumCategory, ForumThread, StudyGroup, StudyGroupMember } from '@/types';

export const CommunityPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { setIsNavigating } = useNavigationStore();
  const [activeTab, setActiveTab] = useState<'forum' | 'study-groups'>('forum');
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Forum state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [showThreadForm, setShowThreadForm] = useState(false);
  
  // Study group state
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [showGroupForm, setShowGroupForm] = useState(false);

  useEffect(() => {
    if (activeTab === 'forum') {
      loadCategories();
    } else {
      loadStudyGroups();
    }
  }, [activeTab]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      const newCategory = await createCategory({
        name: newCategoryName,
        description: newCategoryDescription
      });
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setShowCategoryForm(false);
    } catch (err) {
      setError('Failed to create category');
      console.error(err);
    }
  };

  const handleCreateThread = async () => {
    if (!selectedCategory || !newThreadTitle.trim() || !newThreadContent.trim()) return;
    
    try {
      const newThread = await createThread({
        title: newThreadTitle,
        content: newThreadContent,
        category_id: selectedCategory.id
      });
      
      // Update the category with the new thread
      const updatedCategories = categories.map(cat => 
        cat.id === selectedCategory.id 
          ? { ...cat, threads: [...(cat.threads || []), newThread] } 
          : cat
      );
      
      setCategories(updatedCategories);
      setNewThreadTitle('');
      setNewThreadContent('');
      setShowThreadForm(false);
    } catch (err) {
      setError('Failed to create thread');
      console.error(err);
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
      <div className="community-page">
        <div className="page-header">
          <h1>Community</h1>
          <button onClick={() => onNavigate('landing')} className="back-button">
            Back to Home
          </button>
        </div>
        <div className="loading">Loading community data...</div>
      </div>
    );
  }

  return (
    <div className="community-page">
      <div className="page-header">
        <h1>Community</h1>
        <button onClick={() => onNavigate('landing')} className="back-button">
          Back to Home
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="community-tabs">
        <button 
          className={activeTab === 'forum' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('forum')}
        >
          Forum
        </button>
        <button 
          className={activeTab === 'study-groups' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('study-groups')}
        >
          Study Groups
        </button>
      </div>

      {activeTab === 'forum' && (
        <div className="community-content">
          <div className="categories-section">
            <div className="section-header">
              <h2>Forum Categories</h2>
              {isAuthenticated && (
                <button 
                  onClick={() => setShowCategoryForm(!showCategoryForm)}
                  className="create-category-button"
                >
                  {showCategoryForm ? 'Cancel' : 'Create Category'}
                </button>
              )}
            </div>

            {showCategoryForm && (
              <div className="category-form">
                <h3>Create New Category</h3>
                <input
                  type="text"
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="category-input"
                />
                <textarea
                  placeholder="Category description"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="category-textarea"
                />
                <button onClick={handleCreateCategory} className="submit-button">
                  Create Category
                </button>
              </div>
            )}

            <div className="categories-list">
              {categories.map(category => (
                <div 
                  key={category.id} 
                  className="category-item"
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowThreadForm(true);
                  }}
                >
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <div className="category-stats">
                    <span>{category.threads?.length || 0} threads</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedCategory && showThreadForm && (
            <div className="thread-form">
              <h3>Create Thread in {selectedCategory.name}</h3>
              <input
                type="text"
                placeholder="Thread title"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                className="thread-title-input"
              />
              <textarea
                placeholder="Thread content"
                value={newThreadContent}
                onChange={(e) => setNewThreadContent(e.target.value)}
                className="thread-content-textarea"
              />
              <div className="thread-form-actions">
                <button onClick={handleCreateThread} className="submit-button">
                  Create Thread
                </button>
                <button 
                  onClick={() => setShowThreadForm(false)} 
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'study-groups' && (
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
      )}
    </div>
  );
};
