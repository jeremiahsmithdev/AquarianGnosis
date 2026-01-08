/**
 * AboutContentBlock - Renders a single content block with inline text highlights.
 * Highlights comments and suggestions directly in the text like Google Docs.
 */
import React, { useRef, useCallback, useMemo, useEffect } from 'react';
import { useAboutStore } from '../../stores/aboutStore';
import { useAuthStore } from '../../stores/authStore';
import type { AboutContentBlock as ContentBlockType, AboutComment, AboutEditSuggestion } from '../../types';

interface Props {
  block: ContentBlockType;
}

interface HighlightRange {
  start: number;
  end: number;
  type: 'comment' | 'suggestion';
  id: string;
  data: AboutComment | AboutEditSuggestion;
}

export const AboutContentBlock: React.FC<Props> = ({ block }) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthStore();
  const {
    isReviewMode,
    activeCommentId,
    setCurrentSelection,
    setActiveComment,
    openSidebar
  } = useAboutStore();

  // Build highlight ranges from comments and suggestions
  const highlightRanges = useMemo((): HighlightRange[] => {
    if (!isReviewMode) return [];

    const ranges: HighlightRange[] = [];

    // Add unresolved comments
    block.comments
      .filter(c => !c.is_resolved)
      .forEach(comment => {
        ranges.push({
          start: comment.start_offset,
          end: comment.end_offset,
          type: 'comment',
          id: comment.id,
          data: comment
        });
      });

    // Add pending suggestions
    block.suggestions
      .filter(s => s.status === 'pending')
      .forEach(suggestion => {
        ranges.push({
          start: suggestion.start_offset,
          end: suggestion.end_offset,
          type: 'suggestion',
          id: suggestion.id,
          data: suggestion
        });
      });

    // Sort by start position
    return ranges.sort((a, b) => a.start - b.start);
  }, [block.comments, block.suggestions, isReviewMode]);

  // Handle clicking on a highlight
  const handleHighlightClick = useCallback((id: string, type: 'comment' | 'suggestion') => {
    setActiveComment(id);
    openSidebar('view');
  }, [setActiveComment, openSidebar]);

  // Insert highlights into HTML content
  const getHighlightedContent = useCallback((): string => {
    if (!isReviewMode || highlightRanges.length === 0) {
      return block.content;
    }

    // Parse HTML to get text content mapping
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = block.content;
    const plainText = tempDiv.textContent || '';

    // Build highlighted HTML by inserting spans at correct positions
    let result = '';
    let currentTextOffset = 0;
    let htmlIndex = 0;
    const html = block.content;

    // Track which highlights are active at each position
    const getActiveHighlights = (offset: number): HighlightRange[] => {
      return highlightRanges.filter(r => offset >= r.start && offset < r.end);
    };

    // Process character by character
    while (htmlIndex < html.length) {
      // Check if we're at an HTML tag
      if (html[htmlIndex] === '<') {
        // Find end of tag
        const tagEnd = html.indexOf('>', htmlIndex);
        if (tagEnd !== -1) {
          result += html.substring(htmlIndex, tagEnd + 1);
          htmlIndex = tagEnd + 1;
          continue;
        }
      }

      // Check if we're at an HTML entity
      if (html[htmlIndex] === '&') {
        const entityEnd = html.indexOf(';', htmlIndex);
        if (entityEnd !== -1 && entityEnd - htmlIndex < 10) {
          const entity = html.substring(htmlIndex, entityEnd + 1);

          // Check for highlight boundaries
          const activeHighlights = getActiveHighlights(currentTextOffset);
          const nextActiveHighlights = getActiveHighlights(currentTextOffset + 1);

          // Opening highlights
          for (const h of activeHighlights) {
            if (h.start === currentTextOffset) {
              const className = h.type === 'comment' ? 'comment-highlight' : 'suggestion-highlight';
              result += `<span class="${className}" data-highlight-id="${h.id}">`;
            }
          }

          result += entity;

          // Closing highlights
          for (const h of activeHighlights) {
            if (h.end === currentTextOffset + 1) {
              result += '</span>';
            }
          }

          currentTextOffset += 1;
          htmlIndex = entityEnd + 1;
          continue;
        }
      }

      // Regular text character
      const activeHighlights = getActiveHighlights(currentTextOffset);

      // Opening highlights at this position
      for (const h of highlightRanges) {
        if (h.start === currentTextOffset) {
          const className = h.type === 'comment' ? 'comment-highlight' : 'suggestion-highlight';
          result += `<span class="${className}" data-highlight-id="${h.id}">`;
        }
      }

      result += html[htmlIndex];

      // Closing highlights at this position
      for (const h of highlightRanges) {
        if (h.end === currentTextOffset + 1) {
          result += '</span>';
        }
      }

      currentTextOffset += 1;
      htmlIndex += 1;
    }

    return result;
  }, [block.content, highlightRanges, isReviewMode]);

  // Handle text selection for new comments/suggestions
  // Allow selection even when not in review mode - review mode will be entered when user clicks action button
  const handleMouseUp = useCallback(() => {
    if (!isAuthenticated) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !blockRef.current) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const range = selection.getRangeAt(0);

    // Check if selection is within this block
    if (!blockRef.current.contains(range.commonAncestorContainer)) return;

    // Get the actual start container - if it's an element, find the first text node
    let startContainer = range.startContainer;
    let startOffsetInContainer = range.startOffset;

    // If startContainer is an Element, find the actual text node
    if (startContainer.nodeType === Node.ELEMENT_NODE) {
      const textNodes: Text[] = [];
      const walker = document.createTreeWalker(
        startContainer,
        NodeFilter.SHOW_TEXT,
        null
      );
      let textNode: Text | null;
      while ((textNode = walker.nextNode() as Text | null)) {
        textNodes.push(textNode);
      }
      if (textNodes.length > 0 && startOffsetInContainer < textNodes.length) {
        startContainer = textNodes[startOffsetInContainer] || textNodes[0];
        startOffsetInContainer = 0;
      } else if (textNodes.length > 0) {
        startContainer = textNodes[0];
        startOffsetInContainer = 0;
      }
    }

    // Calculate text offset by counting characters from block start
    const treeWalker = document.createTreeWalker(
      blockRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    let startOffset = 0;
    let foundStart = false;
    let node: Node | null;

    while ((node = treeWalker.nextNode())) {
      if (node === startContainer) {
        startOffset += startOffsetInContainer;
        foundStart = true;
        break;
      }
      startOffset += (node.textContent || '').length;
    }

    if (!foundStart) return;

    const endOffset = startOffset + selectedText.length;
    const rect = range.getBoundingClientRect();

    setCurrentSelection({
      blockId: block.id,
      startOffset,
      endOffset,
      selectedText,
      boundingRect: rect
    });
  }, [isAuthenticated, block.id, setCurrentSelection]);

  // Add click handlers to highlights after render
  useEffect(() => {
    if (!blockRef.current || !isReviewMode) return;

    const highlights = blockRef.current.querySelectorAll('[data-highlight-id]');

    const handleClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const id = target.dataset.highlightId;
      const isComment = target.classList.contains('comment-highlight');
      if (id) {
        handleHighlightClick(id, isComment ? 'comment' : 'suggestion');
      }
    };

    highlights.forEach(el => {
      el.addEventListener('click', handleClick);
    });

    return () => {
      highlights.forEach(el => {
        el.removeEventListener('click', handleClick);
      });
    };
  }, [isReviewMode, highlightRanges, handleHighlightClick]);

  // Update active class on highlights when activeCommentId changes
  useEffect(() => {
    if (!blockRef.current || !isReviewMode) return;

    const highlights = blockRef.current.querySelectorAll('[data-highlight-id]');
    highlights.forEach(el => {
      const id = (el as HTMLElement).dataset.highlightId;
      if (id === activeCommentId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }, [activeCommentId, isReviewMode, highlightRanges]);

  return (
    <div
      ref={blockRef}
      className={`about-block ${block.block_type} ${isReviewMode ? 'review-mode' : ''}`}
      data-block-id={block.id}
      data-block-key={block.block_key}
      onMouseUp={handleMouseUp}
      dangerouslySetInnerHTML={{ __html: getHighlightedContent() }}
    />
  );
};
