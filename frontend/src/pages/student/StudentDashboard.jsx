import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Megaphone, BarChart2 } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { StatCard } from '../../components/StatCard';
import { AttendanceModal } from '../../features/attendance/AttendanceModal';
import { AnnouncementFeed } from '../../features/announcements/AnnouncementFeed';
import { SkeletonCard } from '../../components/SkeletonLoader';
import { STUDENT_NAV } from '../../config/navConfig';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import Particles from '../../components/Particles';

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const item = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/courses'), api.get('/announcements')]).then(([c, a]) => {
      setCourses(c.data.filter(course => course.enrolledStudents?.some(s => (s._id || s) === user?.id)));
      setAnnouncements(a.data);
    }).finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={STUDENT_NAV} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Overview" />
        <main className="flex-1 p-6 space-y-6 overflow-auto bg-grid relative">
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
          <div className="relative z-10 space-y-6">
            <motion.div variants={stagger} initial="initial" animate="animate"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loading
              ? [1, 2, 3].map(i => <motion.div key={i} variants={item}><SkeletonCard /></motion.div>)
              : [
                { title: 'Enrolled Courses', value: courses.length, icon: BookOpen, color: 'violet' },
                { title: 'Announcements', value: announcements.length, icon: Megaphone, color: 'blue' },
                { title: 'Avg Attendance', value: '—', icon: BarChart2, color: 'emerald', subtitle: 'Mark sessions to track' }
              ].map(s => (
                <motion.div key={s.title} variants={item}>
                  <StatCard {...s} />
                </motion.div>
              ))
            }
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <AnnouncementFeed />
          </motion.div>
          </div>
        </main>
      </div>
      <AttendanceModal />
    </div>
  );
};

export default StudentDashboard;
