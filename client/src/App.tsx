import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useNavigationStore, getPageFromPath, getPagePath } from './stores/navigationStore';
import { trackPageView } from './services/analytics';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { MapPage } from './pages/MapPage';
import { CommunityPage } from './pages/CommunityPage';
import { StudyGroupPage } from './pages/StudyGroupPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { MessagingPage } from './pages/MessagingPage';
import { VideoPage } from './pages/VideoPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { Toast } from './components/common/Toast';
import './App.css';
import './styles/landing.css';
import './styles/auth.css';
import './styles/placeholder.css';
import './styles/map.css';
import './styles/messaging.css';
import './styles/about.css';

// Router sync component - keeps Zustand store in sync with URL (one-way sync)
function RouterSync() {
  const location = useLocation();
  const { setCurrentPage } = useNavigationStore();

  // Keep store in sync with URL changes (browser navigation, direct URL access)
  useEffect(() => {
    const pageFromPath = getPageFromPath(location.pathname);
    setCurrentPage(pageFromPath);

    // Track page view for analytics
    trackPageView(location.pathname, pageFromPath);
  }, [location.pathname, setCurrentPage]);

  return null;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, getCurrentUser } = useAuthStore();
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
      <Toast />
      <div className="dev-disclaimer">
        <p>Coming soon!</p>
        <p>This site is in active development</p>
      </div>
      <RouterSync />
      <PWAInstallPrompt />

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
          <ResourcesPage onNavigate={handleNavigate} />
        } />
        
        <Route path="/organizations" element={
          <OrganizationsPage onNavigate={handleNavigate} />
        } />
        
        <Route path="/community" element={
          <CommunityPage onNavigate={handleNavigate} />
        } />
        
        <Route path="/messages" element={
          <MessagingPage
            onNavigate={handleNavigate}
            initialRecipientId={selectedUser?.id}
            initialRecipientUsername={selectedUser?.username}
          />
        } />

        <Route path="/video" element={
          <VideoPage onNavigate={handleNavigate} />
        } />

        <Route path="/about" element={
          <AboutPage onNavigate={handleNavigate} />
        } />

        <Route path="/admin" element={
          user?.is_admin ? (
            <AdminDashboardPage onNavigate={handleNavigate} />
          ) : (
            <div className="access-denied">
              <h1>403 - Access Denied</h1>
              <p>You do not have permission to access this page.</p>
              <button onClick={() => handleNavigate('landing')}>Return Home</button>
            </div>
          )
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
