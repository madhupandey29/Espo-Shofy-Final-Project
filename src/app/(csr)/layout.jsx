'use client';

import Providers from '@/components/provider';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function CSRLayout({ children }) {
  return (
    <ErrorBoundary>
      <Providers>{children}</Providers>
    </ErrorBoundary>
  );
}
