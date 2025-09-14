import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigationStore } from '../stores/navigationStore';
import { getResources, createResource } from '../services/resourceService';
import type { SharedResource } from '@/types';

export const ResourcesPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { setIsNavigating, tabStates, setResourcesTab } = useNavigationStore();
  const [resources, setResources] = useState<SharedResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceDescription, setNewResourceDescription] = useState('');
  const [newResourceType, setNewResourceType] = useState('link');
  const [showResourceForm, setShowResourceForm] = useState(false);

  const activeTab = tabStates.resources;

  const staticResources = {
    blogs: [
      { id: 1, name: "Gnostic Muse", description: "Exploring the depths of gnostic wisdom and spiritual insights", url: "https://www.gnosticmuse.com/" }
    ],
    books: [
      { id: 1, name: "The Perfect Matrimony", description: "Samael Aun Weor's foundational work on spiritual union", author: "Samael Aun Weor" },
      { id: 2, name: "The Revolution of the Dialectic", description: "A guide to revolutionary psychology and self-transformation", author: "Samael Aun Weor" },
      { id: 3, name: "Pistis Sophia", description: "Ancient gnostic text containing the teachings of Jesus", author: "Unknown" }
    ],
    video: [
      { id: 1, name: "Sex - The Secret Gate to Eden", description: "Educational video on healthy sexuality from a gnostic perspective", type: "Video", internalLink: "/video" }
    ],
    audio: [
      { id: 1, name: "Gnostic Audio Lectures", description: "Collection of recorded lectures on gnostic teachings", type: "Audio" }
    ]
  };

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await getResources();
      setResources(data);
      setError(null);
      setApiAvailable(true);
    } catch (err) {
      // API not available - hide shared resources functionality
      setApiAvailable(false);
      setResources([]);
      setError(null);
      console.warn('Resources API not available - using static content only');
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

      <div className="resources-tabs">
        {apiAvailable && (
          <button
            className={activeTab === 'shared' ? 'tab active' : 'tab'}
            onClick={() => setResourcesTab('shared')}
          >
            Shared Resources
          </button>
        )}
        <button
          className={activeTab === 'blogs' ? 'tab active' : 'tab'}
          onClick={() => setResourcesTab('blogs')}
        >
          Blogs
        </button>
        <button
          className={activeTab === 'books' ? 'tab active' : 'tab'}
          onClick={() => setResourcesTab('books')}
        >
          Books
        </button>
        <button
          className={activeTab === 'video' ? 'tab active' : 'tab'}
          onClick={() => setResourcesTab('video')}
        >
          Video
        </button>
        <button
          className={activeTab === 'audio' ? 'tab active' : 'tab'}
          onClick={() => setResourcesTab('audio')}
        >
          Audio
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="resources-content">
        {activeTab === 'shared' && apiAvailable && (
          <>
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
          </>
        )}

        {activeTab === 'blogs' && (
          <div className="resources-list">
            {staticResources.blogs.map(blog => (
              <div key={blog.id} className="resource-item">
                <h3>{blog.name}</h3>
                <p>{blog.description}</p>
                <a href={blog.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                  Visit Blog
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'books' && (
          <>
            <div className="development-message">
              <p>Book resources are currently in development. Below are examples of planned functionality.</p>
            </div>
            <div className="resources-list">
              {staticResources.books.map(book => (
                <div key={book.id} className="resource-item">
                  <h3>{book.name}</h3>
                  <p>{book.description}</p>
                  <div className="resource-stats">
                    <span className="resource-type">Author: {book.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'video' && (
          <div className="resources-list">
            {staticResources.video.map(video => (
              <div key={video.id} className="resource-item">
                <h3>{video.name}</h3>
                <p>{video.description}</p>
                {(video as any).url && (
                  <a href={(video as any).url} target="_blank" rel="noopener noreferrer" className="resource-link">
                    Watch Video
                  </a>
                )}
                {(video as any).internalLink && (
                  <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('video'); }} className="resource-link">
                    Watch Video
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audio' && (
          <>
            <div className="development-message">
              <p>Audio resources are currently in development. Below are examples of planned functionality.</p>
            </div>
            <div className="resources-list">
              {staticResources.audio.map(audio => (
                <div key={audio.id} className="resource-item">
                  <h3>{audio.name}</h3>
                  <p>{audio.description}</p>
                  {(audio as any).url && (
                    <a href={(audio as any).url} target="_blank" rel="noopener noreferrer" className="resource-link">
                      Listen to Audio
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
