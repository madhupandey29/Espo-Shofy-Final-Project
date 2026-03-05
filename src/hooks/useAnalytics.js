'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView, trackScrollDepth } from '@/utils/analytics';

/**
 * Hook to automatically track page views
 */
export const usePageTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      const title = document.title;
      trackPageView(url, title);
    }
  }, [pathname, searchParams]);
};

/**
 * Hook to automatically track scroll depth
 * Tracks at 25%, 50%, 75%, and 100% scroll depths
 */
export const useScrollTracking = () => {
  const scrollDepths = useRef(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

      // Track at specific milestones
      const milestones = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (scrollPercentage >= milestone && !scrollDepths.current.has(milestone)) {
          scrollDepths.current.add(milestone);
          trackScrollDepth(milestone);
        }
      });
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      scrollDepths.current.clear();
    };
  }, []);
};

/**
 * Combined hook for both page and scroll tracking
 */
export const useAnalytics = () => {
  usePageTracking();
  useScrollTracking();
};
