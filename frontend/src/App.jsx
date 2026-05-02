import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherAnnouncements from './pages/teacher/TeacherAnnouncements';
import TeacherCourses from './pages/teacher/TeacherCourses';
import TeacherResources from './pages/teacher/TeacherResources';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import TeacherExams from './pages/teacher/TeacherExams';
import TeacherMarks from './pages/teacher/TeacherMarks';
import TeacherDiscussion from './pages/teacher/TeacherDiscussion';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import StudentDocuments from './pages/student/StudentDocuments';
import StudentPlacements from './pages/student/StudentPlacements';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentExams from './pages/student/StudentExams';
import StudentMarks from './pages/student/StudentMarks';
import StudentDiscussion from './pages/student/StudentDiscussion';

import TeacherRoute from './guards/TeacherRoute';
import StudentRoute from './guards/StudentRoute';

const T = ({ children }) => <TeacherRoute>{children}</TeacherRoute>;
const S = ({ children }) => <StudentRoute>{children}</StudentRoute>;

const App = () => (
  <AuthProvider>
    <SocketProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Teacher routes */}
          <Route path="/teacher/dashboard" element={<T><TeacherDashboard /></T>} />
          <Route path="/teacher/attendance" element={<T><TeacherAttendance /></T>} />
          <Route path="/teacher/announcements" element={<T><TeacherAnnouncements /></T>} />
          <Route path="/teacher/courses" element={<T><TeacherCourses /></T>} />
          <Route path="/teacher/resources" element={<T><TeacherResources /></T>} />
          <Route path="/teacher/assignments" element={<T><TeacherAssignments /></T>} />
          <Route path="/teacher/exams" element={<T><TeacherExams /></T>} />
          <Route path="/teacher/marks" element={<T><TeacherMarks /></T>} />
          <Route path="/teacher/discussion" element={<T><TeacherDiscussion /></T>} />
          <Route path="/teacher/placements" element={<T><TeacherResources /></T>} />

          {/* Student routes */}
          <Route path="/student/dashboard" element={<S><StudentDashboard /></S>} />
          <Route path="/student/courses" element={<S><StudentCourses /></S>} />
          <Route path="/student/announcements" element={<S><StudentAnnouncements /></S>} />
          <Route path="/student/documents" element={<S><StudentDocuments /></S>} />
          <Route path="/student/placements" element={<S><StudentPlacements /></S>} />
          <Route path="/student/assignments" element={<S><StudentAssignments /></S>} />
          <Route path="/student/exams" element={<S><StudentExams /></S>} />
          <Route path="/student/marks" element={<S><StudentMarks /></S>} />
          <Route path="/student/discussion" element={<S><StudentDiscussion /></S>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </SocketProvider>
  </AuthProvider>
);

export default App;
