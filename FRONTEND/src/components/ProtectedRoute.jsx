import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 1. Show loading state while verifying initial authentication
  if (loading) {
    return <Loading fullScreen text="Verifying session authorization..." />;
  }

  // 2. Unauthenticated user -> Redirect to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. User logged in but lacks required role -> Redirect to /unauthorized
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children or nested Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
