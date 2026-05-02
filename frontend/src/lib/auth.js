export const normalizeRole = (role) => String(role || '').trim().toUpperCase();

export const getDashboardPath = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'TEACHER') return '/teacher/dashboard';
  if (normalizedRole === 'STUDENT') return '/student/dashboard';

  return null;
};

