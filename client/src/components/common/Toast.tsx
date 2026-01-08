/**
 * Toast notification component.
 * Displays popup overlay notifications for success/error messages.
 */
import { useNotificationStore } from '../../stores/notificationStore';
import './Toast.css';

export function Toast() {
  const { notification, isFading, clearNotification } = useNotificationStore();

  if (!notification) return null;

  return (
    <div className={`toast-overlay ${isFading ? 'toast-overlay--fading' : ''}`} onClick={clearNotification}>
      <div
        className={`toast toast--${notification.type} ${isFading ? 'toast--fading' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="alert"
        aria-live="polite"
      >
        <div className="toast__icon">
          {notification.type === 'success' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {notification.type === 'error' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {notification.type === 'info' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <span className="toast__message">{notification.message}</span>
        <button
          className="toast__close"
          onClick={clearNotification}
          aria-label="Close notification"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
