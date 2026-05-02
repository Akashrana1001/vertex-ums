import { motion } from 'framer-motion';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { AnnouncementFeed } from '../../features/announcements/AnnouncementFeed';
import { AttendanceModal } from '../../features/attendance/AttendanceModal';
import { STUDENT_NAV } from '../../config/navConfig';
import Particles from '../../components/Particles';

const StudentAnnouncements = () => (
  <div className="flex min-h-screen bg-background">
    <Sidebar links={STUDENT_NAV} />
    <div className="flex-1 flex flex-col min-w-0">
      <Navbar title="Announcements" />
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
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <AnnouncementFeed />
        </motion.div>
      </div>
        </main>
    </div>
    <AttendanceModal />
  </div>
);

export default StudentAnnouncements;
