/**
 * useAnalytics Hook
 *
 * Provides a convenient interface for tracking analytics events in React components.
 * Wraps the analytics service with React-friendly patterns.
 */

import { useCallback } from 'react';
import {
  trackEvent,
  trackPageView,
  AnalyticsEvents,
  isAnalyticsEnabled,
} from '../services/analytics';

interface UseAnalyticsReturn {
  /** Track a custom event */
  track: (eventName: string, properties?: Record<string, unknown>) => void;
  /** Track a page view */
  trackPage: (path: string, pageName?: string) => void;
  /** Check if analytics is enabled */
  isEnabled: boolean;
  /** Pre-defined event names */
  events: typeof AnalyticsEvents;
}

/**
 * Hook for tracking analytics events in components.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { track, events } = useAnalytics();
 *
 *   const handleClick = () => {
 *     track(events.FORUM_THREAD_CREATED, { categoryId: '123' });
 *   };
 *
 *   return <button onClick={handleClick}>Create Thread</button>;
 * }
 * ```
 */
export function useAnalytics(): UseAnalyticsReturn {
  const track = useCallback(
    (eventName: string, properties?: Record<string, unknown>) => {
      trackEvent(eventName, properties);
    },
    []
  );

  const trackPage = useCallback((path: string, pageName?: string) => {
    trackPageView(path, pageName);
  }, []);

  return {
    track,
    trackPage,
    isEnabled: isAnalyticsEnabled(),
    events: AnalyticsEvents,
  };
}
