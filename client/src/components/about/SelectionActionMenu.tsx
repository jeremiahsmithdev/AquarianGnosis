/**
 * SelectionActionMenu - Floating menu that appears when text is selected in review mode.
 * Allows user to add a comment or suggest an edit.
 * Updates position on scroll to stay with the selected text.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useAboutStore } from '../../stores/aboutStore';

export const SelectionActionMenu: React.FC = () => {
  const { currentSelection, openSidebar, setCurrentSelection } = useAboutStore();
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  // Update position based on current selection range
  const updatePosition = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !currentSelection) {
      // Selection was lost (user clicked elsewhere) - clear state
      if (currentSelection) {
        setCurrentSelection(null);
      }
      return;
    }

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left + (rect.width / 2)
      });
    } catch {
      // Selection might be invalid, clear it
      setCurrentSelection(null);
    }
  }, [currentSelection, setCurrentSelection]);

  // Set initial position and listen for scroll/selection changes
  useEffect(() => {
    if (!currentSelection) {
      setPosition(null);
      return;
    }

    // Set initial position
    setPosition({
      top: currentSelection.boundingRect.bottom + 8,
      left: currentSelection.boundingRect.left + (currentSelection.boundingRect.width / 2)
    });

    // Update position on scroll
    const handleScroll = () => {
      updatePosition();
    };

    // Clear selection when user clicks elsewhere and loses selection
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setCurrentSelection(null);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [currentSelection, updatePosition, setCurrentSelection]);

  if (!currentSelection || !position) return null;

  const handleComment = () => {
    openSidebar('comment', { top: position.top });
  };

  const handleSuggest = () => {
    openSidebar('suggest', { top: position.top });
  };

  const handleCancel = () => {
    setCurrentSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  const style: React.CSSProperties = {
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
    transform: 'translateX(-50%)'
  };

  return (
    <div className="selection-action-menu" style={style}>
      <button onClick={handleComment} className="action-btn comment">
        <span className="icon">💬</span>
        Comment
      </button>
      <button onClick={handleSuggest} className="action-btn suggest">
        <span className="icon">✏️</span>
        Suggest Edit
      </button>
      <button onClick={handleCancel} className="action-btn cancel">
        ×
      </button>
    </div>
  );
};
