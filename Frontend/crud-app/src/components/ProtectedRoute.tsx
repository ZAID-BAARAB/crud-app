// src/components/ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Pass the intended path via state 
    return <Navigate to="/login" state={{ from: location.pathname, message: "Sorry ! You have to login first " }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;


