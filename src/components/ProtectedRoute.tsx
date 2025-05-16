import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can return a loading spinner here if you want
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />; // Renders the child route's element if user is authenticated
};

export default ProtectedRoute;
