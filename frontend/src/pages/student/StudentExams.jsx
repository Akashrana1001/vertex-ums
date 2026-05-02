import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, BookOpen, AlertCircle } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { SkeletonList } from '../../components/SkeletonLoader';
import { STUDENT_NAV } from '../../config/navConfig';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import Particles from '../../components/Particles';

const TYPE_COLORS = {
  midterm: { label: 'text-blue-400', bg: 'bg-blue-600/15 border-blue-600/20' },
  final: { label: 'text-violet-400', bg: 'bg-violet-600/15 border-violet-600/20' },
  quiz: { label: 'text-emerald-400', bg: 'bg-emerald-600/15 border-emerald-600/20' },
  practical: { label: 'text-orange-400', bg: 'bg-orange-600/15 border-orange-600/20' },
};

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const item = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const StudentExams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/exams'), api.get('/courses')]).then(([e, c]) => {
      const enrolled = c.data.filter(course =>
        course.enrolledStudents?.some(s => (s._id || s) === user?.id)
      );
      const ids = new Set(enrolled.map(c => c._id));
      setExams(e.data.filter(ex => ids.has(ex.courseId?._id || ex.courseId)));
    }).finally(() => setLoading(false));
  }, [user]);

  const upcoming = exams.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = exams.filter(e => new Date(e.date) < new Date()).sort((a, b) => new Date(b.date) - new Date(a.date));

  const ExamCard = ({ exam }) => {
    const color = TYPE_COLORS[exam.type] || TYPE_COLORS.midterm;
    const isPast = new Date(exam.date) < new Date();
    return (
      <Card className={`transition-colors ${isPast ? 'opacity-60' : 'hover:border-violet-800/40'}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-medium capitalize ${color.bg} ${color.label}`}>
              {exam.type}
            </div>
            {isPast && <Badge variant="secondary" className="text-[10px]">Completed</Badge>}
          </div>
          <h3 className="font-semibold text-foreground mb-1">{exam.title}</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <BookOpen size={11} /> {exam.courseId?.title || 'Course'}
          </div>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar size={11} />
              {new Date(exam.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={11} />
              {new Date(exam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {exam.duration} minutes
            </div>
            {exam.room && (
              <div className="flex items-center gap-2">
                <MapPin size={11} /> {exam.room}
              </div>
            )}
            <div className="pt-1 flex items-center justify-between">
              <span>Total Marks: <span className="font-medium text-foreground">{exam.totalMarks}</span></span>
              {!isPast && (
                <span className={`font-medium ${
                  (new Date(exam.date) - new Date()) < 86400000 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {Math.ceil((new Date(exam.date) - new Date()) / 86400000)} day{Math.ceil((new Date(exam.date) - new Date()) / 86400000) !== 1 ? 's' : ''} left
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={STUDENT_NAV} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Exam Schedule" />
        <main className="flex-1 p-6 space-y-8 overflow-auto bg-grid relative">
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
          {loading ? <SkeletonList /> : exams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Calendar size={40} className="text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No exams scheduled for your courses yet.</p>
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={14} className="text-orange-400" />
                    <h2 className="text-sm font-semibold text-foreground">Upcoming Exams</h2>
                    <Badge variant="secondary" className="text-[10px]">{upcoming.length}</Badge>
                  </div>
                  <motion.div variants={stagger} initial="initial" animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {upcoming.map(e => <motion.div key={e._id} variants={item}><ExamCard exam={e} /></motion.div>)}
                  </motion.div>
                </div>
              )}
              {past.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-sm font-semibold text-muted-foreground">Past Exams</h2>
                    <Badge variant="secondary" className="text-[10px]">{past.length}</Badge>
                  </div>
                  <motion.div variants={stagger} initial="initial" animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {past.map(e => <motion.div key={e._id} variants={item}><ExamCard exam={e} /></motion.div>)}
                  </motion.div>
                </div>
              )}
            </>
          )}
        </div>
        </main>
      </div>
    </div>
  );
};

export default StudentExams;
