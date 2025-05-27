
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth-context';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsAuthChecked(true);
    }
  }, [loading]);

  // Only make decisions after we've checked auth state
  if (!isAuthChecked) {
    return <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin h-8 w-8 border-4 border-hragency-blue border-t-transparent rounded-full"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />; // Renders the child route's element if user is authenticated
};

export default ProtectedRoute;
