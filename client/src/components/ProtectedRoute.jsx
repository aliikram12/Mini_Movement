import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { PageLoader } from './Loader';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Small delay to allow Zustand to rehydrate (prevent flicker)
  useEffect(() => {
    // If already authenticated by some means, don't wait
    if (isAuthenticated) {
      setLoading(false);
      return;
    }

    const checkRehydration = () => {
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        // Just a tiny buffer for Zustand's internal processing
        const timer = setTimeout(() => setLoading(false), 30);
        return () => clearTimeout(timer);
      }
      setLoading(false);
    };
    
    checkRehydration();
  }, [isAuthenticated]);

  if (loading) return <PageLoader />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};
