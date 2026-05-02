import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { AnnouncementComposer } from '../../features/announcements/AnnouncementComposer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/ui/badge';
import { SkeletonList } from '../../components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { TEACHER_NAV } from '../../config/navConfig';
import api from '../../api/axios';
import useSocket from '../../hooks/useSocket';
import Particles from '../../components/Particles';

const TeacherAnnouncements = () => {
  const { socket } = useSocket();
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/announcements'), api.get('/courses')])
      .then(([a, c]) => { setItems(a.data); setCourses(c.data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNew = p => setItems(prev => [p, ...prev]);
    socket.on('newAnnouncement', onNew);
    return () => socket.off('newAnnouncement', onNew);
  }, [socket]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={TEACHER_NAV} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Announcements" />
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
          <AnnouncementComposer courses={courses} />

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Posted Announcements</CardTitle>
                <Badge variant="secondary">{items.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <SkeletonList rows={4} />
              ) : items.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No announcements yet</p>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence initial={false}>
                    {items.map((a, i) => (
                      <motion.div
                        key={a._id || i}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-4 rounded-xl hover:bg-accent border border-transparent hover:border-border transition-all"
                      >
                        <Avatar name={a.teacherName || a.teacherId?.name || 'T'} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-medium text-foreground">
                              {a.teacherName || a.teacherId?.name}
                            </span>
                            {a.courseId?.title && (
                              <Badge variant="secondary" className="text-[10px]">{a.courseId.title}</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs leading-relaxed">{a.content}</p>
                          <p className="text-muted-foreground/40 text-[11px] mt-1.5">
                            {new Date(a.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherAnnouncements;
