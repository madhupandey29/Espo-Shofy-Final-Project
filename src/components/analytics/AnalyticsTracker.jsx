'use client';

import { useAnalytics } from '@/hooks/useAnalytics';

/**
 * Client component that automatically tracks page views and scroll depth
 * Add this to your layout to enable automatic tracking
 */
export default function AnalyticsTracker() {
  useAnalytics();
  return null;
}
