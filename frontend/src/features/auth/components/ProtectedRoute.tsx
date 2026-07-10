import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  /** Optional: restrict to specific roles. If omitted, any authenticated user is allowed. */
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { state } = useAuth();
  const location = useLocation();

  /* Session is being restored — show full-screen spinner */
  if (state.isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f9f9f9',
        }}
      >
        <CircularProgress sx={{ color: '#aa3bff' }} />
      </Box>
    );
  }

  /* Not authenticated — redirect to login, preserving intended destination */
  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  /* Role check (future use) */
  if (allowedRoles && state.user && !allowedRoles.includes(state.user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}