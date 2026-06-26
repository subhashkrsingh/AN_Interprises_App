import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

function RoleGuard({ allowedRoles, children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleGuard;
