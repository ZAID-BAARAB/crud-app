// src/components/ProtectedRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../redux/store';
import { selectCurrentUser } from '../redux/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const currentUser = useSelector((state: RootState) => selectCurrentUser(state));
  const location = useLocation();

  // If there's no logged-in user, send them to /login,
  // but remember where they were trying to go:
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Otherwise render the protected page
  return <>{children}</>;
};

export default ProtectedRoute;
