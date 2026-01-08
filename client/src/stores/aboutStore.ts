/**
 * aboutStore - Zustand store for About page review/edit system.
 * Manages content blocks, comments, suggestions, and UI state.
 */
import { create } from 'zustand';
import { apiClient } from '../services/api';
import type {
  AboutContentBlock,
  AboutComment,
  AboutEditSuggestion,
  AboutContentResponse,
  TextSelection,
  CommentCreateRequest,
  SuggestionCreateRequest
} from '../types';

interface AboutState {
  // Content
  blocks: AboutContentBlock[];
  isContentLoading: boolean;
  canEdit: boolean;
  error: string | null;

  // Selection state
  currentSelection: TextSelection | null;

  // Sidebar state
  isSidebarOpen: boolean;
  sidebarMode: 'view' | 'comment' | 'suggest';
  activeCommentId: string | null;

  // Review mode
  isReviewMode: boolean;

  // Actions
  fetchContent: () => Promise<void>;
  setCurrentSelection: (selection: TextSelection | null) => void;
  openSidebar: (mode: 'view' | 'comment' | 'suggest') => void;
  closeSidebar: () => void;
  setActiveComment: (commentId: string | null) => void;
  toggleReviewMode: () => void;

  // Comment actions
  createComment: (data: CommentCreateRequest) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  resolveComment: (commentId: string) => Promise<void>;
  replyToComment: (commentId: string, content: string) => Promise<void>;

  // Suggestion actions
  createSuggestion: (data: SuggestionCreateRequest) => Promise<void>;
  deleteSuggestion: (suggestionId: string) => Promise<void>;
  acceptSuggestion: (suggestionId: string, note?: string) => Promise<void>;
  rejectSuggestion: (suggestionId: string, note?: string) => Promise<void>;

  // Utility
  clearError: () => void;
}

export const useAboutStore = create<AboutState>()((set, get) => ({
  // Initial state
  blocks: [],
  isContentLoading: false,
  canEdit: false,
  error: null,
  currentSelection: null,
  isSidebarOpen: false,
  sidebarMode: 'view',
  activeCommentId: null,
  isReviewMode: false,

  // Fetch content from API
  fetchContent: async () => {
    set({ isContentLoading: true, error: null });
    try {
      // Add cache-busting parameter to ensure fresh data
      const response = await apiClient.get<AboutContentResponse>('/about/content', {
        params: { _t: Date.now() }
      });
      set({
        blocks: response.data.blocks,
        canEdit: response.data.can_edit,
        isContentLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to load content';
      set({ error: errorMessage, isContentLoading: false });
    }
  },

  // Selection management
  setCurrentSelection: (selection) => {
    set({ currentSelection: selection });
  },

  // Sidebar management
  openSidebar: (mode) => {
    set({
      isSidebarOpen: true,
      sidebarMode: mode
    });
  },

  closeSidebar: () => {
    set({
      isSidebarOpen: false,
      sidebarMode: 'view',
      activeCommentId: null,
      currentSelection: null
    });
  },

  setActiveComment: (commentId) => {
    set({ activeCommentId: commentId });
  },

  toggleReviewMode: () => {
    set((state) => ({ isReviewMode: !state.isReviewMode }));
  },

  // Comment actions
  createComment: async (data) => {
    try {
      const response = await apiClient.post<AboutComment>('/about/comments', data);
      const newComment = response.data;

      // Add comment to the appropriate block and reset all selection state
      set((state) => ({
        blocks: state.blocks.map((block) =>
          block.id === data.block_id
            ? { ...block, comments: [...block.comments, newComment] }
            : block
        ),
        isSidebarOpen: false,
        sidebarMode: 'view',
        currentSelection: null,
        activeCommentId: null
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create comment';
      set({ error: errorMessage });
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    if (!commentId) {
      throw new Error('Comment ID is required');
    }
    try {
      await apiClient.delete(`/about/comments/${commentId}`);

      // Remove comment from blocks and reset all selection state
      set((state) => ({
        blocks: state.blocks.map((block) => ({
          ...block,
          comments: block.comments.filter((c) => c.id !== commentId)
        })),
        isSidebarOpen: false,
        sidebarMode: 'view',
        currentSelection: null,
        activeCommentId: null
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to delete comment';
      console.error('Delete comment failed:', { commentId, status: error.response?.status, error });
      set({ error: errorMessage });
      throw error;
    }
  },

  resolveComment: async (commentId) => {
    try {
      const response = await apiClient.post<AboutComment>(`/about/comments/${commentId}/resolve`);
      const updatedComment = response.data;

      // Update comment in blocks and reset all selection state
      set((state) => ({
        blocks: state.blocks.map((block) => ({
          ...block,
          comments: block.comments.map((c) =>
            c.id === commentId ? updatedComment : c
          )
        })),
        isSidebarOpen: false,
        sidebarMode: 'view',
        currentSelection: null,
        activeCommentId: null
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to resolve comment';
      set({ error: errorMessage });
      throw error;
    }
  },

  replyToComment: async (commentId, content) => {
    try {
      const response = await apiClient.post(`/about/comments/${commentId}/reply`, { content });
      const newReply = response.data;

      // Add reply to the appropriate comment
      set((state) => ({
        blocks: state.blocks.map((block) => ({
          ...block,
          comments: block.comments.map((c) =>
            c.id === commentId
              ? { ...c, replies: [...c.replies, newReply] }
              : c
          )
        }))
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to add reply';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Suggestion actions
  createSuggestion: async (data) => {
    try {
      const response = await apiClient.post<AboutEditSuggestion>('/about/suggestions', data);
      const newSuggestion = response.data;

      // Add suggestion to the appropriate block and reset all selection state
      set((state) => ({
        blocks: state.blocks.map((block) =>
          block.id === data.block_id
            ? { ...block, suggestions: [...block.suggestions, newSuggestion] }
            : block
        ),
        isSidebarOpen: false,
        sidebarMode: 'view',
        currentSelection: null,
        activeCommentId: null
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create suggestion';
      set({ error: errorMessage });
      throw error;
    }
  },

  deleteSuggestion: async (suggestionId) => {
    try {
      await apiClient.delete(`/about/suggestions/${suggestionId}`);

      // Remove suggestion from blocks and reset all selection state
      set((state) => ({
        blocks: state.blocks.map((block) => ({
          ...block,
          suggestions: block.suggestions.filter((s) => s.id !== suggestionId)
        })),
        isSidebarOpen: false,
        sidebarMode: 'view',
        currentSelection: null,
        activeCommentId: null
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to delete suggestion';
      set({ error: errorMessage });
      throw error;
    }
  },

  acceptSuggestion: async (suggestionId, note) => {
    try {
      await apiClient.post<AboutEditSuggestion>(
        `/about/suggestions/${suggestionId}/accept`,
        note ? { review_note: note } : {}
      );

      // Reset sidebar state before refetching
      set({
        isSidebarOpen: false,
        sidebarMode: 'view',
        currentSelection: null,
        activeCommentId: null
      });

      // Refetch content to get updated block content
      await get().fetchContent();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to accept suggestion';
      set({ error: errorMessage });
      throw error;
    }
  },

  rejectSuggestion: async (suggestionId, note) => {
    try {
      const response = await apiClient.post<AboutEditSuggestion>(
        `/about/suggestions/${suggestionId}/reject`,
        note ? { review_note: note } : {}
      );
      const updatedSuggestion = response.data;

      // Update suggestion status in blocks
      set((state) => ({
        blocks: state.blocks.map((block) => ({
          ...block,
          suggestions: block.suggestions.map((s) =>
            s.id === suggestionId ? updatedSuggestion : s
          )
        }))
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to reject suggestion';
      set({ error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));
