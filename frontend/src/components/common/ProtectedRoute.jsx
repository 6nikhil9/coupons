// src/components/common/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Not logged in, redirect to home page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Logged in but not authorized for this role
    // You could redirect to a 403 page or dashboard
    return <Navigate to="/" state={{ from: location, unauthorized: true }} replace />;
  }

  return children;
};

export default ProtectedRoute;