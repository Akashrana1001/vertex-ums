import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { CourseList } from '../../features/courses/CourseList';
import { AttendanceModal } from '../../features/attendance/AttendanceModal';
import { STUDENT_NAV } from '../../config/navConfig';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Particles from '../../components/Particles';

const StudentCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses').then(r => setCourses(r.data)).finally(() => setLoading(false));
  }, []);

  const enrolledIds = courses
    .filter(c => c.enrolledStudents?.some(s => (s._id || s) === user?.id))
    .map(c => c._id);

  const enroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      setCourses(p => p.map(c =>
        c._id === courseId
          ? { ...c, enrolledStudents: [...(c.enrolledStudents || []), { _id: user.id, name: user.name }] }
          : c
      ));
      toast.success('Enrolled successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enroll');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={STUDENT_NAV} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Courses" />
        <main className="flex-1 p-6 overflow-auto bg-grid relative">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Particles
              particleColors={["#3b82f6", "#60a5fa", "#2563eb"]}
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover={false}
              alphaParticles={false}
              disableRotation={false}
              pixelRatio={1}
            />
          </div>
          <div className="relative z-10 h-full flex flex-col space-y-4">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-foreground">Available Courses</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Browse and enroll in courses</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <CourseList
              courses={courses}
              loading={loading}
              onEnroll={enroll}
              enrolledIds={enrolledIds}
            />
          </motion.div>
        </div>
        </main>
      </div>
      <AttendanceModal />
    </div>
  );
};

export default StudentCourses;
