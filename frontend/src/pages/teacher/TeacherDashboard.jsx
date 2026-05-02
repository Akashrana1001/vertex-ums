import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Megaphone, Activity, Zap, ArrowUpRight } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { StatCard } from '../../components/StatCard';
import { OnlineDot } from '../../components/OnlineDot';
import { SkeletonCard } from '../../components/SkeletonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/Avatar';
import { TEACHER_NAV } from '../../config/navConfig';
import useSocket from '../../hooks/useSocket';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import Particles from '../../components/Particles';

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const item = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const TeacherDashboard = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [onlineMap, setOnlineMap] = useState({});
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/courses'), api.get('/announcements')])
      .then(([c, a]) => { setCourses(c.data); setAnnouncements(a.data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onStatus = ({ userId, isOnline }) => {
      setOnlineMap(p => ({ ...p, [userId]: isOnline }));
      if (isOnline) setFeed(p => [{ userId, ts: new Date() }, ...p].slice(0, 8));
    };
    socket.on('userStatusUpdate', onStatus);
    return () => socket.off('userStatusUpdate', onStatus);
  }, [socket]);

  const mine = courses;
  const totalStudents = new Set(mine.flatMap(c => c.enrolledStudents?.map(s => s._id || s) || [])).size;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={TEACHER_NAV} />
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
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {loading
              ? [1, 2, 3, 4].map(i => <motion.div key={i} variants={item}><SkeletonCard /></motion.div>)
              : [
                { title: 'My Courses', value: mine.length, icon: BookOpen, color: 'violet' },
                { title: 'Total Students', value: totalStudents, icon: Users, color: 'blue' },
                { title: 'Announcements', value: announcements.length, icon: Megaphone, color: 'emerald' },
                { title: 'Online Now', value: Object.values(onlineMap).filter(Boolean).length, icon: Zap, color: 'orange' }
              ].map(s => (
                <motion.div key={s.title} variants={item}>
                  <StatCard {...s} />
                </motion.div>
              ))
            }
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Activity feed */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Activity</CardTitle>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {feed.length === 0
                  ? <p className="text-muted-foreground text-sm text-center py-8">Waiting for activity…</p>
                  : (
                    <div className="space-y-2">
                      {feed.map((f, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 text-xs">
                          <OnlineDot isOnline />
                          <span className="text-muted-foreground">Student came online</span>
                          <span className="text-muted-foreground/50 ml-auto">{f.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </motion.div>
                      ))}
                    </div>
                  )
                }
              </CardContent>
            </Card>

            {/* Course list */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Courses</CardTitle>
                  <a href="/teacher/courses" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                    View all <ArrowUpRight size={12} />
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                {mine.length === 0
                  ? <p className="text-muted-foreground text-sm text-center py-8">No courses yet.</p>
                  : (
                    <div className="space-y-2">
                      {mine.slice(0, 5).map(c => (
                        <div key={c._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors">
                          <div className="p-2 rounded-lg bg-violet-600/15 border border-violet-600/20">
                            <BookOpen size={13} className="text-violet-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                            <p className="text-xs text-muted-foreground">{c.enrolledStudents?.length || 0} students</p>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">
                            {c.enrolledStudents?.length || 0}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )
                }
              </CardContent>
            </Card>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
