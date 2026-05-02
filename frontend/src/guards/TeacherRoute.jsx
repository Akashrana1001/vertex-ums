import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getDashboardPath, normalizeRole } from '../lib/auth';

const TeacherRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const role = normalizeRole(user.role);
  if (role === 'TEACHER') return children;

  const dashboardPath = getDashboardPath(role);
  if (dashboardPath) return <Navigate to={dashboardPath} replace />;

  return <Navigate to="/login" replace />;
};

export default TeacherRoute;
