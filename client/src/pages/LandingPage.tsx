import React from 'react';
import { GnosticCross } from '../components/landing/GnosticCross';
import { useAuthStore } from '../stores/authStore';

interface LandingPageProps {
  onNavigate: (section: string) => void;
  onAuthClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onAuthClick }) => {
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleSectionClick = (section: string) => {
    onNavigate(section);
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <h1>Aquarian Gnosis</h1>
        </div>
        <div className="nav-links">
          <button onClick={() => onNavigate('about')} className="nav-link">
            About
          </button>
          <button onClick={() => onNavigate('resources')} className="nav-link">
            Resources
          </button>
          <button onClick={() => onNavigate('organizations')} className="nav-link">
            Organizations
          </button>
          <button onClick={() => onNavigate('community')} className="nav-link">
            Community
          </button>
          <button onClick={() => onNavigate('map')} className="nav-link">
            Map
          </button>
          {isAuthenticated && (
            <button onClick={() => onNavigate('messages')} className="nav-link">
              Messages
            </button>
          )}
        </div>
        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">Welcome, {user?.username}</span>
              <button onClick={logout} className="auth-button">
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={onAuthClick} className="auth-button">
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="landing-main">
        <div className="landing-hero">
          <div className="hero-content">
            <h2 className="hero-title">
              Connecting Gnostics in the Aquarian Age
            </h2>
            <p className="hero-subtitle">
              A unified platform for seekers of gnosis to connect, share resources, 
              and form study groups worldwide
            </p>
          </div>
          
          <div className="gnostic-cross-wrapper">
            <GnosticCross onSectionClick={handleSectionClick} />
          </div>

          <div className="hero-quote">
            <p className="quote-text">
              "All religions are precious pearls strung upon golden thread of divinity."
            </p>
            <p className="quote-author">- Samael Aun Weor</p>
            <p className="wisdom-text">
              The Tree of Life has many branches.
            </p>
          </div>

          <div className="hero-description">
            <p>
              Click on each quadrant of the Gnostic Cross to explore different sections
              of our community platform
            </p>
            <p className="mission-link">
              <button onClick={() => onNavigate('about')} className="text-link">
                Learn about our mission and philosophy →
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <p>
          &copy; 2025 Aquarian Gnosis. Uniting seekers of truth across <i>all</i> traditions.
        </p>
      </footer>
    </div>
  );
};
