import { useSelector } from 'react-redux';

export const useAuthCheck = () => {
  const { user } = useSelector((state) => state.auth);

  const requireAuth = (callback) => {
    return (...args) => {
      if (!user) {
        // Only use pathname to avoid encoding loops with existing redirect parameters
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

        if (typeof window !== 'undefined') {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
        return false;
      }
      return callback(...args);
    };
  };

  return { requireAuth, isAuthenticated: !!user };
};
