import { create } from 'zustand';
import { apiService } from '../services/api';
import type { Message, MessageRequest } from '../types';

interface Conversation {
  user_id: string;
  username: string;
  latest_message: string | null;
  latest_message_time: string | null;
  unread_count: number;
}

interface MessageState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getConversations: () => Promise<void>;
  getMessages: (conversationWith?: string, limit?: number, offset?: number) => Promise<void>;
  sendMessage: (message: MessageRequest) => Promise<void>;
  markMessageRead: (messageId: string) => Promise<void>;
  getUnreadCount: () => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  getConversations: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const conversations = await apiService.getConversations();
      set({ conversations, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to load conversations', 
        isLoading: false,
        conversations: []
      });
    }
  },

  getMessages: async (conversationWith, limit = 50, offset = 0) => {
    set({ isLoading: true, error: null });
    
    try {
      const messages = await apiService.getMessages(conversationWith, limit, offset);
      set({ messages: messages.reverse(), isLoading: false }); // Reverse to show oldest first
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to load messages', 
        isLoading: false,
        messages: []
      });
    }
  },

  sendMessage: async (messageData) => {
    set({ error: null });
    
    try {
      const message = await apiService.sendMessage(messageData);
      
      // Add message to current messages
      const currentMessages = get().messages;
      set({ messages: [...currentMessages, message] });
      
      // Refresh conversations to update latest message
      get().getConversations();
    } catch (error: any) {
      set({ error: error.message || 'Failed to send message' });
      throw error;
    }
  },

  markMessageRead: async (messageId) => {
    try {
      await apiService.markMessageRead(messageId);
      
      // Update message in current messages
      const currentMessages = get().messages;
      const updatedMessages = currentMessages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      );
      set({ messages: updatedMessages });
      
      // Refresh unread count and conversations
      get().getUnreadCount();
      get().getConversations();
    } catch (error: any) {
      set({ error: error.message || 'Failed to mark message as read' });
    }
  },

  getUnreadCount: async () => {
    try {
      const result = await apiService.getUnreadCount();
      set({ unreadCount: result.unread_count });
    } catch (error: any) {
      // Don't set error state for unread count as it's not critical
      console.error('Failed to get unread count:', error);
    }
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  },

  clearError: () => set({ error: null }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));