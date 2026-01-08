/**
 * Notification store for managing toast notifications.
 * Provides a simple API for showing success/error messages as popup overlays.
 */
import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationState {
  notification: Notification | null;
  isFading: boolean;

  showNotification: (type: NotificationType, message: string) => void;
  clearNotification: () => void;
}

const DISPLAY_DURATION = 3000;
const FADE_DURATION = 300;

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notification: null,
  isFading: false,

  showNotification: (type: NotificationType, message: string) => {
    const id = Date.now().toString();
    set({ notification: { id, type, message }, isFading: false });

    // Start fade-out after display duration
    setTimeout(() => {
      if (get().notification?.id === id) {
        set({ isFading: true });

        // Remove after fade animation completes
        setTimeout(() => {
          set((state) =>
            state.notification?.id === id ? { notification: null, isFading: false } : state
          );
        }, FADE_DURATION);
      }
    }, DISPLAY_DURATION);
  },

  clearNotification: () => {
    set({ isFading: true });
    setTimeout(() => {
      set({ notification: null, isFading: false });
    }, FADE_DURATION);
  },
}));
