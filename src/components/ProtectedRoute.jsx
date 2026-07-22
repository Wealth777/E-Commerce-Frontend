import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const getLoginRouteForRole = (role) => {
  switch (role) {
    case 'vendor':
      return '/vendor/login';
    case 'founder':
      return '/founder/login';
    default:
      return '/login';
  }
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={getLoginRouteForRole(requiredRole || role)} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;