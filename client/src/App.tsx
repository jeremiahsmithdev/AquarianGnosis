import React, { useState, useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { MapPage } from './pages/MapPage';
import { MessagingPage } from './pages/MessagingPage';
import './styles/landing.css';
import './styles/auth.css';
import './styles/placeholder.css';
import './styles/map.css';
import './styles/messaging.css';

type PageType = 'landing' | 'auth' | 'map' | 'resources' | 'organizations' | 'community' | 'messages';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [selectedUser, setSelectedUser] = useState<{ id: string; username: string } | null>(null);
  const { isAuthenticated, getCurrentUser } = useAuthStore();

  useEffect(() => {
    // Check authentication status on app load
    const token = localStorage.getItem('access_token');
    if (token) {
      getCurrentUser();
    }
  }, [getCurrentUser]);

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleAuthSuccess = () => {
    setCurrentPage('landing');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'auth':
        return <AuthPage onSuccess={handleAuthSuccess} />;
      
      case 'map':
        return (
          <MapPage 
            onNavigate={handleNavigate}
            onUserSelect={(userId) => {
              // For now, just navigate to messages - in a real app we'd fetch user info
              setSelectedUser({ id: userId, username: `User ${userId.slice(0, 8)}` });
              setCurrentPage('messages');
            }}
          />
        );
      
      case 'resources':
        return (
          <div className="page-placeholder">
            <div className="placeholder-content">
              <h1>Resources</h1>
              <p>Coming in Phase 3! This section will include:</p>
              <ul>
                <li>Complete collection of Samael Aun Weor's works</li>
                <li>Radio stations and audio lectures</li>
                <li>Video content and documentaries</li>
                <li>Study materials and practice guides</li>
              </ul>
              <button onClick={() => handleNavigate('landing')} className="back-button">
                Back to Home
              </button>
            </div>
          </div>
        );
      
      case 'organizations':
        return (
          <div className="page-placeholder">
            <div className="placeholder-content">
              <h1>Organizations</h1>
              <p>Coming in Phase 3! This directory will feature:</p>
              <ul>
                <li>Major gnostic organizations worldwide</li>
                <li>Local centers and study groups</li>
                <li>Contact information and resources</li>
                <li>Integration with the community map</li>
              </ul>
              <button onClick={() => handleNavigate('landing')} className="back-button">
                Back to Home
              </button>
            </div>
          </div>
        );
      
      case 'community':
        return (
          <div className="page-placeholder">
            <div className="placeholder-content">
              <h1>Community Forum</h1>
              <p>Coming in Phase 2! The community section will offer:</p>
              <ul>
                <li>Discussion forums on gnostic topics</li>
                <li>Study group coordination</li>
                <li>Q&A with experienced practitioners</li>
                <li>Regional discussions and meetups</li>
              </ul>
              <button onClick={() => handleNavigate('landing')} className="back-button">
                Back to Home
              </button>
            </div>
          </div>
        );
      
      case 'messages':
        return (
          <MessagingPage
            onNavigate={handleNavigate}
            initialRecipientId={selectedUser?.id}
            initialRecipientUsername={selectedUser?.username}
          />
        );
      
      case 'landing':
      default:
        return (
          <LandingPage
            onNavigate={handleNavigate}
            onAuthClick={() => handleNavigate('auth')}
          />
        );
    }
  };

  return (
    <div className="app">
      {renderCurrentPage()}
    </div>
  );
}

export default App;
