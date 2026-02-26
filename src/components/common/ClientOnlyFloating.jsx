'use client';

import { useEffect, useState } from 'react';
import FloatingButtons from '@/components/common/FloatingButtons';
import FloatingChatbot from '@/components/chatbot/FloatingChatbot';

export default function ClientOnlyFloating() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <FloatingButtons />
      <FloatingChatbot />
    </>
  );
}
