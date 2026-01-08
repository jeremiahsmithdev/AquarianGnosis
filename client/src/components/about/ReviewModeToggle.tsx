/**
 * ReviewModeToggle - Subtle toggle for entering/exiting review mode.
 * Only visible to authenticated users.
 */
import React from 'react';
import { useAboutStore } from '../../stores/aboutStore';
import { useAuthStore } from '../../stores/authStore';

export const ReviewModeToggle: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { isReviewMode, toggleReviewMode, blocks, canEdit } = useAboutStore();

  if (!isAuthenticated) return null;

  // Count pending items
  const pendingComments = blocks.reduce(
    (count, block) => count + block.comments.filter(c => !c.is_resolved).length,
    0
  );
  const pendingSuggestions = blocks.reduce(
    (count, block) => count + block.suggestions.filter(s => s.status === 'pending').length,
    0
  );
  const totalPending = pendingComments + pendingSuggestions;

  return (
    <button
      className={`review-mode-toggle ${isReviewMode ? 'active' : ''}`}
      onClick={toggleReviewMode}
      title={isReviewMode ? 'Exit review mode' : 'Enter review mode to comment or suggest edits'}
    >
      <span className="toggle-icon">{isReviewMode ? '✓' : '✎'}</span>
      <span className="toggle-label">
        {isReviewMode ? 'Review Mode' : 'Review'}
      </span>
      {totalPending > 0 && canEdit && (
        <span className="pending-badge">{totalPending}</span>
      )}
    </button>
  );
};
