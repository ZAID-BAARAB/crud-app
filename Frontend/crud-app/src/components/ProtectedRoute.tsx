// src/components/ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Pass the intended path via state
    return <Navigate to="/login" state={{ from: location.pathname, message: "You have to login first to Create products" }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;


// import { useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';
// import { selectIsAuthenticated } from '../redux/slices/authSlice';
// import { useEffect } from 'react';

// const ProtectedRoute = () => {
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   useEffect(() => {
//     console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
//     console.log('ProtectedRoute - current path:', location.pathname);
//   }, [isAuthenticated, location]);

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;