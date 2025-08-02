import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useNavigationStore, getPageFromPath, getPagePath } from './stores/navigationStore';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { MapPage } from './pages/MapPage';
import { MessagingPage } from './pages/MessagingPage';
import './App.css';
import './styles/landing.css';
import './styles/auth.css';
import './styles/placeholder.css';
import './styles/map.css';
import './styles/messaging.css';

// Router sync component - keeps Zustand store in sync with URL (one-way sync)
function RouterSync() {
  const location = useLocation();
  const { setCurrentPage } = useNavigationStore();

  // Keep store in sync with URL changes (browser navigation, direct URL access)
  useEffect(() => {
    const pageFromPath = getPageFromPath(location.pathname);
    setCurrentPage(pageFromPath);
  }, [location.pathname, setCurrentPage]);

  return null;
}

function AppContent() {
  const navigate = useNavigate();
  const { isAuthenticated, getCurrentUser } = useAuthStore();
  const { 
    selectedUser,
    setIsNavigating,
    setSelectedUser
  } = useNavigationStore();

  useEffect(() => {
    // Check authentication status on app load
    const token = localStorage.getItem('access_token');
    if (token) {
      getCurrentUser();
    }
  }, [getCurrentUser]);

  const handleNavigate = (page: string) => {
    setIsNavigating(true);
    const path = getPagePath(page as any);
    navigate(path);
    setTimeout(() => setIsNavigating(false), 100);
  };

  const handleAuthSuccess = () => {
    setIsNavigating(true);
    navigate('/');
    setTimeout(() => setIsNavigating(false), 100);
  };

  const handleUserSelect = (userId: string) => {
    const user = { id: userId, username: `User ${userId.slice(0, 8)}` };
    setSelectedUser(user);
    setIsNavigating(true);
    navigate('/messages');
    setTimeout(() => setIsNavigating(false), 100);
  };

  const { isNavigating } = useNavigationStore();

  return (
    <div className="app">
      <RouterSync />
      
      {/* Loading state for smooth transitions */}
      {isNavigating && (
        <div className="navigation-loading">
          <div className="loading-bar"></div>
        </div>
      )}
      
      <Routes>
        <Route path="/" element={
          <LandingPage
            onNavigate={handleNavigate}
            onAuthClick={() => handleNavigate('auth')}
          />
        } />
        
        <Route path="/auth" element={<AuthPage onSuccess={handleAuthSuccess} />} />
        
        <Route path="/map" element={
          <MapPage 
            onNavigate={handleNavigate}
            onUserSelect={handleUserSelect}
          />
        } />
        
        <Route path="/resources" element={
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
        } />
        
        <Route path="/organizations" element={
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
        } />
        
        <Route path="/community" element={
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
        } />
        
        <Route path="/messages" element={
          <MessagingPage
            onNavigate={handleNavigate}
            initialRecipientId={selectedUser?.id}
            initialRecipientUsername={selectedUser?.username}
          />
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
