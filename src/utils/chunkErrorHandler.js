// Chunk loading error handler
export const handleChunkError = (error) => {
  if (error?.name === 'ChunkLoadError' || error?.message?.includes('Loading chunk')) {
    console.warn('Chunk loading error detected, reloading page:', error);
    // Reload the page to recover from chunk loading errors
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
    return true;
  }
  return false;
};

// Global error handler for unhandled chunk errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (handleChunkError(event.error)) {
      event.preventDefault();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (handleChunkError(event.reason)) {
      event.preventDefault();
    }
  });
}