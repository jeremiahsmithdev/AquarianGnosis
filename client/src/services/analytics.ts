/**
 * PostHog Analytics Service
 *
 * Provides centralized analytics tracking with PostHog.
 * Handles initialization, user identification, and event tracking.
 */

import posthog from 'posthog-js';
import type { User } from '@/types';

// PostHog configuration
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST as string || 'https://us.i.posthog.com';

// Only track on production domain
const PRODUCTION_HOSTNAME = 'aquariangnosis.org';

// Track if PostHog has been initialized
let isInitialized = false;

/**
 * Check if we're running in production environment.
 */
function isProductionEnvironment(): boolean {
  return window.location.hostname === PRODUCTION_HOSTNAME;
}

/**
 * Initialize PostHog analytics.
 * Should be called once at app startup in main.tsx.
 * Only initializes in production environment.
 */
export function initAnalytics(): void {
  if (isInitialized) {
    return;
  }

  // Only track in production
  if (!isProductionEnvironment()) {
    console.info('Analytics disabled in development environment.');
    return;
  }

  if (!POSTHOG_KEY) {
    console.warn('PostHog API key not configured. Analytics disabled.');
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Capture page views manually for SPA routing
    capture_pageview: false,
    // Capture page leaves for session duration
    capture_pageleave: true,
    // Respect Do Not Track browser setting
    respect_dnt: true,
    // Disable session recording (privacy-focused)
    disable_session_recording: true,
    // Persist user across sessions
    persistence: 'localStorage',
    // Bootstrap with anonymous ID
    bootstrap: {
      distinctId: undefined,
    },
  });

  isInitialized = true;
}

/**
 * Check if analytics is available and initialized.
 */
export function isAnalyticsEnabled(): boolean {
  return isInitialized && !!POSTHOG_KEY;
}

/**
 * Identify a user after login.
 * Links all future events to this user.
 */
export function identifyUser(user: User): void {
  if (!isAnalyticsEnabled()) return;

  posthog.identify(user.id, {
    username: user.username,
    email: user.email,
    // Add any other user properties you want to track
  });
}

/**
 * Reset user identity on logout.
 * Creates a new anonymous session.
 */
export function resetUser(): void {
  if (!isAnalyticsEnabled()) return;

  posthog.reset();
}

/**
 * Track a page view.
 * Call this on route changes in SPA.
 */
export function trackPageView(path: string, pageName?: string): void {
  if (!isAnalyticsEnabled()) return;

  posthog.capture('$pageview', {
    $current_url: window.location.origin + path,
    page_name: pageName,
  });
}

/**
 * Track a custom event.
 * Use for user actions like button clicks, form submissions, etc.
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  if (!isAnalyticsEnabled()) return;

  posthog.capture(eventName, properties);
}

/**
 * Set user properties without identifying.
 * Useful for adding metadata to anonymous users.
 */
export function setUserProperties(properties: Record<string, unknown>): void {
  if (!isAnalyticsEnabled()) return;

  posthog.people.set(properties);
}

// Pre-defined event names for consistency
export const AnalyticsEvents = {
  // Auth events
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',

  // Navigation events
  NAV_ITEM_CLICKED: 'nav_item_clicked',

  // Community events
  FORUM_THREAD_CREATED: 'forum_thread_created',
  FORUM_POST_CREATED: 'forum_post_created',
  FORUM_THREAD_VIEWED: 'forum_thread_viewed',

  // Study group events
  STUDY_GROUP_CREATED: 'study_group_created',
  STUDY_GROUP_JOINED: 'study_group_joined',
  STUDY_GROUP_LEFT: 'study_group_left',

  // Resource events
  RESOURCE_SHARED: 'resource_shared',
  RESOURCE_VOTED: 'resource_voted',
  RESOURCE_VIEWED: 'resource_viewed',

  // Map events
  MAP_LOCATION_ADDED: 'map_location_added',
  MAP_LOCATION_VIEWED: 'map_location_viewed',
  MAP_FILTERED: 'map_filtered',

  // Messaging events
  MESSAGE_SENT: 'message_sent',
  CONVERSATION_STARTED: 'conversation_started',
} as const;

// Export posthog instance for advanced usage
export { posthog };
