import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type PageType = 'landing' | 'auth' | 'map' | 'resources' | 'organizations' | 'community' | 'messages';

interface NavigationState {
  currentPage: PageType;
  selectedUser: { id: string; username: string } | null;
  isNavigating: boolean;
  
  // Actions
  setCurrentPage: (page: PageType) => void;
  setSelectedUser: (user: { id: string; username: string } | null) => void;
  setIsNavigating: (navigating: boolean) => void;
  
  // Navigation helpers
  navigateToPage: (page: PageType) => void;
  navigateToMessages: (user: { id: string; username: string }) => void;
}

export const useNavigationStore = create<NavigationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentPage: 'landing',
      selectedUser: null,
      isNavigating: false,

      // Basic setters
      setCurrentPage: (page) => set({ currentPage: page }),
      setSelectedUser: (user) => set({ selectedUser: user }),
      setIsNavigating: (navigating) => set({ isNavigating: navigating }),

      // Navigation actions
      navigateToPage: (page) => {
        set({ isNavigating: true });
        
        // Fast state update for immediate UI response
        set({ currentPage: page });
        
        // Complete navigation
        setTimeout(() => {
          set({ isNavigating: false });
        }, 100);
      },

      navigateToMessages: (user) => {
        set({ isNavigating: true });
        
        // Set user and navigate to messages
        set({ 
          selectedUser: user, 
          currentPage: 'messages' 
        });
        
        setTimeout(() => {
          set({ isNavigating: false });
        }, 100);
      },
    }),
    { name: 'navigation-store' }
  )
);

// Helper to get page path from PageType
export const getPagePath = (page: PageType): string => {
  switch (page) {
    case 'landing': return '/';
    case 'auth': return '/auth';
    case 'map': return '/map';
    case 'resources': return '/resources';
    case 'organizations': return '/organizations';
    case 'community': return '/community';
    case 'messages': return '/messages';
    default: return '/';
  }
};

// Helper to get PageType from path
export const getPageFromPath = (path: string): PageType => {
  switch (path) {
    case '/': return 'landing';
    case '/auth': return 'auth';
    case '/map': return 'map';
    case '/resources': return 'resources';
    case '/organizations': return 'organizations';
    case '/community': return 'community';
    case '/messages': return 'messages';
    default: return 'landing';
  }
};