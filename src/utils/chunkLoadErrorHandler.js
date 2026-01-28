/**
 * Chunk Load Error Handler
 * Handles ChunkLoadError by implementing retry logic and cache clearing
 */

let retryCount = 0;
const MAX_RETRIES = 3;

export function handleChunkLoadError(error) {
  console.error('ChunkLoadError detected:', error);
  
  // Check if it's actually a chunk load error
  const isChunkError = error?.name === 'ChunkLoadError' || 
                      error?.message?.includes('Loading chunk') ||
                      error?.message?.includes('Loading CSS chunk');
  
  if (!isChunkError) {
    throw error; // Re-throw if it's not a chunk error
  }
  
  retryCount++;
  
  if (retryCount <= MAX_RETRIES) {
    console.log(`🔄 Attempting to recover from ChunkLoadError (attempt ${retryCount}/${MAX_RETRIES})`);
    
    // Clear caches and retry
    return clearCachesAndRetry();
  } else {
    console.log('❌ Max retries exceeded, forcing page reload');
    // Force reload after max retries
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
}

async function clearCachesAndRetry() {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear service worker cache
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
    }
    
    // Clear browser caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // Clear localStorage related to Next.js
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('__next') || key.startsWith('_next')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    
    console.log('✅ Caches cleared, reloading page...');
    
    // Reload the page
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
  } catch (error) {
    console.error('Error clearing caches:', error);
    // Fallback to simple reload
    window.location.reload();
  }
}

// Global error handler for unhandled chunk load errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const error = event.error;
    
    if (error?.name === 'ChunkLoadError' || 
        error?.message?.includes('Loading chunk')) {
      event.preventDefault(); // Prevent default error handling
      handleChunkLoadError(error);
    }
  });
  
  // Handle unhandled promise rejections (for dynamic imports)
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    if (error?.name === 'ChunkLoadError' || 
        error?.message?.includes('Loading chunk')) {
      event.preventDefault(); // Prevent default error handling
      handleChunkLoadError(error);
    }
  });
}

// Reset retry count on successful navigation
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    retryCount = 0;
  });
}