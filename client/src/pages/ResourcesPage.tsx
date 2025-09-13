import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigationStore } from '../stores/navigationStore';
import { getResources, createResource } from '../services/resourceService';
import type { SharedResource } from '@/types';

export const ResourcesPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { setIsNavigating } = useNavigationStore();
  const [resources, setResources] = useState<SharedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceDescription, setNewResourceDescription] = useState('');
  const [newResourceType, setNewResourceType] = useState('link');
  const [showResourceForm, setShowResourceForm] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await getResources();
      setResources(data);
      setError(null);
    } catch (err) {
      setError('Failed to load resources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async () => {
    if (!newResourceTitle.trim()) return;
    
    try {
      const newResource = await createResource({
        title: newResourceTitle,
        url: newResourceUrl,
        description: newResourceDescription,
        resource_type: newResourceType
      });
      setResources([...resources, newResource]);
      setNewResourceTitle('');
      setNewResourceUrl('');
      setNewResourceDescription('');
      setShowResourceForm(false);
    } catch (err) {
      setError('Failed to create resource');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="resources-page">
        <div className="page-header">
          <h1>Resources</h1>
          <button onClick={() => onNavigate('landing')} className="back-button">
            Back to Home
          </button>
        </div>
        <div className="loading">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="resources-page">
      <div className="page-header">
        <h1>Resources</h1>
        <button onClick={() => onNavigate('landing')} className="back-button">
          Back to Home
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="resources-content">
        <div className="section-header">
          <h2>Shared Resources</h2>
          {isAuthenticated && (
            <button 
              onClick={() => setShowResourceForm(!showResourceForm)}
              className="create-resource-button"
            >
              {showResourceForm ? 'Cancel' : 'Share Resource'}
            </button>
          )}
        </div>

        {showResourceForm && (
          <div className="resource-form">
            <h3>Share a New Resource</h3>
            <input
              type="text"
              placeholder="Resource title"
              value={newResourceTitle}
              onChange={(e) => setNewResourceTitle(e.target.value)}
              className="resource-input"
            />
            <input
              type="text"
              placeholder="Resource URL (optional)"
              value={newResourceUrl}
              onChange={(e) => setNewResourceUrl(e.target.value)}
              className="resource-input"
            />
            <textarea
              placeholder="Resource description"
              value={newResourceDescription}
              onChange={(e) => setNewResourceDescription(e.target.value)}
              className="resource-textarea"
            />
            <select
              value={newResourceType}
              onChange={(e) => setNewResourceType(e.target.value)}
              className="resource-select"
            >
              <option value="link">Link</option>
              <option value="book">Book</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
            <button onClick={handleCreateResource} className="submit-button">
              Share Resource
            </button>
          </div>
        )}

        <div className="resources-list">
          {resources.map(resource => (
            <div key={resource.id} className="resource-item">
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              {resource.url && (
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                  Visit Resource
                </a>
              )}
              <div className="resource-stats">
                <span className="resource-type">{resource.resource_type}</span>
                <span>👍 {resource.upvotes} 👎 {resource.downvotes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
