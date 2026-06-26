import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminProtectedRoute() {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has admin role
  const isAdmin = user?.roles?.some(role => 
    ['super_admin', 'admin', 'manager'].includes(role.slug || role)
  ) || user?.isAdmin;

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}