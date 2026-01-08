/**
 * AboutPage - Philosophy and mission statement for Aquarian Gnosis
 * Displays the project's philosophical foundations, spiritual principles, and vision.
 * Supports review mode for authenticated users to comment and suggest edits.
 */
import React, { useEffect } from 'react';
import { useAboutStore } from '../stores/aboutStore';
import { useAuthStore } from '../stores/authStore';
import {
  AboutContentBlock,
  CommentSidebar,
  ReviewModeToggle,
  SelectionActionMenu
} from '../components/about';
import '../styles/about.css';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuthStore();
  const {
    blocks,
    isContentLoading,
    error,
    isReviewMode,
    currentSelection,
    sidebarMode,
    fetchContent,
    closeSidebar,
    setReviewMode
  } = useAboutStore();

  // Fetch content on mount
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Reset review state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      closeSidebar();
      setReviewMode(false);
    }
  }, [isAuthenticated, closeSidebar, setReviewMode]);

  // Show loading state
  if (isContentLoading && blocks.length === 0) {
    return (
      <div className="about-page">
        <div className="page-header">
          <h1>About</h1>
          <button onClick={() => onNavigate('landing')} className="back-button">
            Back to Home
          </button>
        </div>
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error && blocks.length === 0) {
    return (
      <div className="about-page">
        <div className="page-header">
          <h1>About</h1>
          <button onClick={() => onNavigate('landing')} className="back-button">
            Back to Home
          </button>
        </div>
        <div className="error-state">
          <p>Failed to load content: {error}</p>
          <button onClick={fetchContent}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`about-page ${isReviewMode ? 'review-mode-active' : ''}`}>
      <div className="fixed-header-stack">
        <div className="page-header">
          <h1>About</h1>
          <div className="header-actions">
            <ReviewModeToggle />
            <button onClick={() => onNavigate('landing')} className="back-button">
              Back to Home
            </button>
          </div>
        </div>

        {isAuthenticated ? (
          <div className={`review-mode-banner ${isReviewMode ? 'open' : ''}`}>
            Select text to add a comment or suggest an edit
          </div>
        ) : (
          <div className="review-mode-banner open guest-banner">
            This is a living document. <span className="sign-in-link" onClick={() => onNavigate('auth')}>Sign in</span> to comment, suggest edits, and help shape the vision.
          </div>
        )}
      </div>

      <article className="about-content">
        {blocks.map((block) => (
          <AboutContentBlock key={block.id} block={block} />
        ))}
      </article>

      {/* Comment/suggestion sidebar */}
      <CommentSidebar />

      {/* Selection action menu - show when text selected and not in input mode */}
      {isAuthenticated && currentSelection && sidebarMode === 'view' && (
        <SelectionActionMenu />
      )}
    </div>
  );
};
