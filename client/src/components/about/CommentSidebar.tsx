/**
 * CommentSidebar - Persistent sidebar showing all comments and suggestions.
 * Pushes the document to the left when in review mode (like Google Docs).
 */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAboutStore } from '../../stores/aboutStore';
import { useAuthStore } from '../../stores/authStore';
import type { AboutComment, AboutEditSuggestion } from '../../types';

type AnnotationItem =
  | { type: 'comment'; data: AboutComment; blockKey: string }
  | { type: 'suggestion'; data: AboutEditSuggestion; blockKey: string };

export const CommentSidebar: React.FC = () => {
  const { user } = useAuthStore();
  const {
    blocks,
    isReviewMode,
    isSidebarOpen,
    sidebarMode,
    currentSelection,
    activeCommentId,
    canEdit,
    closeSidebar,
    createComment,
    createSuggestion,
    deleteComment,
    resolveComment,
    replyToComment,
    acceptSuggestion,
    rejectSuggestion,
    deleteSuggestion,
    setActiveComment
  } = useAboutStore();

  const [commentContent, setCommentContent] = useState('');
  const [suggestedText, setSuggestedText] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Collect all annotations from all blocks
  const allAnnotations = useMemo((): AnnotationItem[] => {
    const items: AnnotationItem[] = [];

    blocks.forEach(block => {
      // Add unresolved comments
      block.comments
        .filter(c => !c.is_resolved)
        .forEach(comment => {
          items.push({ type: 'comment', data: comment, blockKey: block.block_key });
        });

      // Add pending suggestions
      block.suggestions
        .filter(s => s.status === 'pending')
        .forEach(suggestion => {
          items.push({ type: 'suggestion', data: suggestion, blockKey: block.block_key });
        });
    });

    // Sort by creation date (oldest first)
    return items.sort((a, b) =>
      new Date(a.data.created_at).getTime() - new Date(b.data.created_at).getTime()
    );
  }, [blocks]);

  // Ref to track annotation card elements for scrolling
  const annotationRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Reset form when selection changes
  useEffect(() => {
    if (currentSelection) {
      setCommentContent('');
      setSuggestedText(currentSelection.selectedText);
      setError(null);
    }
  }, [currentSelection]);

  // Scroll to active comment in sidebar when it changes
  useEffect(() => {
    if (activeCommentId) {
      const element = annotationRefs.current.get(activeCommentId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeCommentId]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitComment = async () => {
    if (!currentSelection || !commentContent.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createComment({
        block_id: currentSelection.blockId,
        start_offset: currentSelection.startOffset,
        end_offset: currentSelection.endOffset,
        selected_text: currentSelection.selectedText,
        content: commentContent.trim()
      });
      setCommentContent('');
    } catch (err: any) {
      setError(err.message || 'Failed to create comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSuggestion = async () => {
    if (!currentSelection || !suggestedText.trim()) return;
    if (suggestedText === currentSelection.selectedText) {
      setError('Suggested text must be different from original');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createSuggestion({
        block_id: currentSelection.blockId,
        start_offset: currentSelection.startOffset,
        end_offset: currentSelection.endOffset,
        original_text: currentSelection.selectedText,
        suggested_text: suggestedText.trim()
      });
      setSuggestedText('');
    } catch (err: any) {
      setError(err.message || 'Failed to create suggestion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await replyToComment(commentId, replyContent.trim());
      setReplyContent('');
    } catch (err: any) {
      setError(err.message || 'Failed to add reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async (commentId: string) => {
    const confirmed = window.confirm('Are you sure you want to resolve this comment?');
    if (!confirmed) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await resolveComment(commentId);
      setSuccessMessage('Comment resolved');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to resolve comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccept = async (suggestionId: string) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await acceptSuggestion(suggestionId);
      setSuccessMessage('Suggestion accepted and applied');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to accept suggestion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (suggestionId: string) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await rejectSuggestion(suggestionId);
      setSuccessMessage('Suggestion rejected');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reject suggestion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: AnnotationItem) => {
    const itemType = item.type === 'comment' ? 'comment' : 'suggestion';
    const confirmed = window.confirm(`Are you sure you want to delete this ${itemType}?`);
    if (!confirmed) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (item.type === 'comment') {
        await deleteComment(item.data.id);
      } else {
        await deleteSuggestion(item.data.id);
      }
      setSuccessMessage(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToHighlight = (id: string) => {
    const highlight = document.querySelector(`[data-highlight-id="${id}"]`);
    if (highlight) {
      highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveComment(id);
    }
  };

  return (
    <div className={`review-sidebar ${isReviewMode ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>Review</h3>
        <span className="annotation-count">
          {allAnnotations.length} {allAnnotations.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {error && <div className="sidebar-error">{error}</div>}
      {successMessage && <div className="sidebar-success">{successMessage}</div>}

      <div className="sidebar-content">
        {/* New Comment/Suggestion Form */}
        {currentSelection && (
          <div className="new-annotation-form">
            <div className="selected-text-preview">
              <span className="label">Selected:</span>
              <p>"{currentSelection.selectedText}"</p>
            </div>

            {sidebarMode === 'comment' && (
              <>
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Add your comment..."
                  rows={3}
                  disabled={isSubmitting}
                  autoFocus
                />
                <div className="form-actions">
                  <button onClick={closeSidebar} disabled={isSubmitting}>Cancel</button>
                  <button
                    className="primary"
                    onClick={handleSubmitComment}
                    disabled={isSubmitting || !commentContent.trim()}
                  >
                    Comment
                  </button>
                </div>
              </>
            )}

            {sidebarMode === 'suggest' && (
              <>
                <textarea
                  value={suggestedText}
                  onChange={(e) => setSuggestedText(e.target.value)}
                  placeholder="Enter replacement text..."
                  rows={3}
                  disabled={isSubmitting}
                  autoFocus
                />
                <div className="form-actions">
                  <button onClick={closeSidebar} disabled={isSubmitting}>Cancel</button>
                  <button
                    className="primary"
                    onClick={handleSubmitSuggestion}
                    disabled={isSubmitting || !suggestedText.trim() || suggestedText === currentSelection.selectedText}
                  >
                    Suggest
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Annotations List */}
        <div className="annotations-list">
          {allAnnotations.length === 0 && !currentSelection && (
            <div className="empty-state">
              <p>No comments or suggestions yet.</p>
              <p className="hint">Select text to add a comment or suggest an edit.</p>
            </div>
          )}

          {allAnnotations.map((item) => (
            <div
              key={item.data.id}
              ref={(el) => {
                if (el) {
                  annotationRefs.current.set(item.data.id, el);
                } else {
                  annotationRefs.current.delete(item.data.id);
                }
              }}
              className={`annotation-card ${item.type} ${activeCommentId === item.data.id ? 'active' : ''}`}
              onClick={() => scrollToHighlight(item.data.id)}
            >
              <div className="annotation-header">
                <span className={`type-indicator ${item.type}`} />
                <span className="author">
                  {item.type === 'comment'
                    ? (item.data as AboutComment).author_username
                    : (item.data as AboutEditSuggestion).author_username
                  }
                </span>
                <span className="date">{formatDate(item.data.created_at)}</span>
              </div>

              <div className="quoted-text">
                "{item.type === 'comment'
                  ? (item.data as AboutComment).selected_text
                  : (item.data as AboutEditSuggestion).original_text
                }"
              </div>

              {item.type === 'comment' ? (
                <>
                  <div className="annotation-body">
                    {(item.data as AboutComment).content}
                  </div>

                  {/* Replies */}
                  {(item.data as AboutComment).replies.length > 0 && (
                    <div className="replies">
                      {(item.data as AboutComment).replies.map((reply) => (
                        <div key={reply.id} className="reply">
                          <span className="author">{reply.author_username}</span>
                          <span className="date">{formatDate(reply.created_at)}</span>
                          <p>{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply form (expanded view) */}
                  {activeCommentId === item.data.id && (
                    <div className="reply-form">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Reply..."
                        disabled={isSubmitting}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitReply(item.data.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleSubmitReply(item.data.id)}
                        disabled={isSubmitting || !replyContent.trim()}
                      >
                        Reply
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="annotation-actions">
                    {((item.data as AboutComment).author_id === user?.id || canEdit) && (
                      <button className="delete" onClick={(e) => { e.stopPropagation(); handleDelete(item); }}>
                        Delete
                      </button>
                    )}
                    {canEdit && (
                      <button className="resolve" onClick={(e) => { e.stopPropagation(); handleResolve(item.data.id); }}>
                        Resolve
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="suggestion-diff">
                    <span className="arrow">→</span>
                    <span className="new-text">"{(item.data as AboutEditSuggestion).suggested_text}"</span>
                  </div>

                  {/* Admin review actions */}
                  {canEdit && (item.data as AboutEditSuggestion).status === 'pending' && (
                    <div className="annotation-actions review-actions">
                      <button className="reject" onClick={(e) => { e.stopPropagation(); handleReject(item.data.id); }}>
                        Reject
                      </button>
                      <button className="accept" onClick={(e) => { e.stopPropagation(); handleAccept(item.data.id); }}>
                        Accept
                      </button>
                    </div>
                  )}

                  {/* Owner delete */}
                  {(item.data as AboutEditSuggestion).author_id === user?.id &&
                   (item.data as AboutEditSuggestion).status === 'pending' && (
                    <div className="annotation-actions">
                      <button className="delete" onClick={(e) => { e.stopPropagation(); handleDelete(item); }}>
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
