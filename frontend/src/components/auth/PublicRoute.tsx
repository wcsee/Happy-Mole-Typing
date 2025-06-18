import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/levels',
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="route-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>验证身份中...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to protected area
  if (isAuthenticated) {
    // Check if there's a saved location to redirect to
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  // User is not authenticated, show the public route
  return <>{children}</>;
};

export default PublicRoute;