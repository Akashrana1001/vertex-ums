import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, BookOpen } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { SkeletonList } from '../../components/SkeletonLoader';
import { AttendanceModal } from '../../features/attendance/AttendanceModal';
import { STUDENT_NAV } from '../../config/navConfig';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import Particles from '../../components/Particles';

const TYPE_COLORS = { notes: 'text-violet-400', slides: 'text-blue-400', reference: 'text-emerald-400', video: 'text-orange-400' };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const item = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const StudentDocuments = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState('');

  useEffect(() => {
    Promise.all([api.get('/study-materials'), api.get('/courses')]).then(([m, c]) => {
      const enrolled = c.data.filter(course => course.enrolledStudents?.some(s => (s._id || s) === user?.id));
      setCourses(enrolled);
      const ids = new Set(enrolled.map(c => c._id));
      setMaterials(m.data.filter(mat => ids.has(mat.courseId?._id || mat.courseId)));
    }).finally(() => setLoading(false));
  }, [user]);

  const filtered = filterCourse ? materials.filter(m => (m.courseId?._id || m.courseId) === filterCourse) : materials;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={STUDENT_NAV} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Study Materials" />
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
          <div className="relative z-10 h-full flex flex-col space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Lecture Notes & Resources</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} file{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)}
              className="h-8 px-3 text-xs rounded-xl bg-input border border-border text-foreground focus:outline-none">
              <option value="">All Courses</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>

          {loading ? <SkeletonList /> : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen size={40} className="text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No study materials available yet.</p>
            </div>
          ) : (
            <motion.div variants={stagger} initial="initial" animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(m => {
                const courseTitle = courses.find(c => c._id === (m.courseId?._id || m.courseId))?.title;
                return (
                  <motion.div key={m._id} variants={item}>
                    <Card className="hover:border-violet-800/40 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg bg-secondary border border-border ${TYPE_COLORS[m.type] || 'text-violet-400'}`}>
                            <FileText size={15} />
                          </div>
                          <a href={m.fileUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors px-2 py-1 rounded-lg hover:bg-violet-900/20">
                            <Download size={12} /> Download
                          </a>
                        </div>
                        <h3 className="font-semibold text-foreground text-sm mb-1 truncate">{m.title}</h3>
                        {m.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{m.description}</p>}
                        <div className="flex items-center gap-2 flex-wrap mt-2">
                          <Badge variant="secondary" className={`text-[10px] capitalize ${TYPE_COLORS[m.type]}`}>{m.type}</Badge>
                          {courseTitle && <Badge variant="secondary" className="text-[10px]">{courseTitle}</Badge>}
                        </div>
                        <p className="text-[10px] text-muted-foreground/50 mt-2">
                          Uploaded {new Date(m.uploadedAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
        </main>
      </div>
      <AttendanceModal />
    </div>
  );
};

export default StudentDocuments;
