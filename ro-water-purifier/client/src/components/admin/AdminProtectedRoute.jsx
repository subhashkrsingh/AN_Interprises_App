import { Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMeQuery } from '../../features/api/adminApi.js';

export default function AdminProtectedRoute() {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  const { isLoading, isFetching } = useMeQuery(undefined, { skip: !token });

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (isLoading || isFetching) {
    return (
      <Box sx={{ display: 'grid', minHeight: '100vh', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <Outlet />;
}
