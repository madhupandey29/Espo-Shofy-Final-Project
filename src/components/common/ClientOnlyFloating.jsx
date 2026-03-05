'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const LazyFloatingButtons = dynamic(() => import('@/components/common/FloatingButtons'), {
  ssr: false,
  loading: () => null,
});

const LazyFloatingChatbot = dynamic(() => import('@/components/chatbot/FloatingChatbot'), {
  ssr: false,
  loading: () => null,
});

export default function ClientOnlyFloating() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <LazyFloatingButtons />
      <LazyFloatingChatbot />
    </>
  );
}
