import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type PageType = 'landing' | 'auth' | 'map' | 'resources' | 'organizations' | 'community' | 'messages' | 'video' | 'about';

interface NavigationState {
  currentPage: PageType;
  selectedUser: { id: string; username: string } | null;
  isNavigating: boolean;

  // Tab states for pages with tabs
  tabStates: {
    resources: 'blogs' | 'books' | 'video' | 'audio' | 'art';
    organizations: 'major' | 'local' | 'independent';
  };

  // Actions
  setCurrentPage: (page: PageType) => void;
  setSelectedUser: (user: { id: string; username: string } | null) => void;
  setIsNavigating: (navigating: boolean) => void;
  setResourcesTab: (tab: 'blogs' | 'books' | 'video' | 'audio' | 'art') => void;
  setOrganizationsTab: (tab: 'major' | 'local' | 'independent') => void;

  // Navigation helpers
  navigateToPage: (page: PageType) => void;
  navigateToMessages: (user: { id: string; username: string }) => void;
}

export const useNavigationStore = create<NavigationState>()(
  devtools(
    persist(
      (set, get) => ({
      // Initial state
      currentPage: 'landing',
      selectedUser: null,
      isNavigating: false,
      tabStates: {
        resources: 'blogs',
        organizations: 'major',
      },

      // Basic setters
      setCurrentPage: (page) => set({ currentPage: page }),
      setSelectedUser: (user) => set({ selectedUser: user }),
      setIsNavigating: (navigating) => set({ isNavigating: navigating }),
      setResourcesTab: (tab) => set((state) => ({
        tabStates: { ...state.tabStates, resources: tab }
      })),
      setOrganizationsTab: (tab) => set((state) => ({
        tabStates: { ...state.tabStates, organizations: tab }
      })),

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
      {
        name: 'navigation-storage',
        partialize: (state) => ({ tabStates: state.tabStates }), // Only persist tab states
      }
    ),
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
    case 'video': return '/video';
    case 'about': return '/about';
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
    case '/video': return 'video';
    case '/about': return 'about';
    default: return 'landing';
  }
};