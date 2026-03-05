'use client';

import dynamic from 'next/dynamic';

// Lazy load heavy components for better performance
export const LazyFloatingChatbot = dynamic(
  () => import('@/components/chatbot/FloatingChatbot'),
  {
    ssr: false,
    loading: () => null,
  }
);

export const LazyFloatingButtons = dynamic(
  () => import('@/components/common/FloatingButtons'),
  {
    ssr: false,
    loading: () => null,
  }
);

export const LazyBackToTop = dynamic(
  () => import('@/components/common/back-to-top'),
  {
    ssr: false,
    loading: () => null,
  }
);

// Carousel components - heavy dependencies
export const LazyProductSlider = dynamic(
  () => import('@/components/product/ProductSlider'),
  {
    loading: () => <div className="skeleton-loader" style={{ height: '400px' }} />,
  }
);

export const LazyBannerArea = dynamic(
  () => import('@/components/banner/banner-area'),
  {
    loading: () => <div className="skeleton-loader" style={{ height: '300px' }} />,
  }
);
