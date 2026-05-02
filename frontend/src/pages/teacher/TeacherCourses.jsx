import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { CourseList } from '../../features/courses/CourseList';
import { Avatar } from '../../components/Avatar';
import { OnlineDot } from '../../components/OnlineDot';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from '../../components/ui/dialog';
import { SkeletonList } from '../../components/SkeletonLoader';
import { TEACHER_NAV } from '../../config/navConfig';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Particles from '../../components/Particles';

const TeacherCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [viewCourse, setViewCourse] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get('/courses').then(r => setCourses(r.data)).finally(() => setLoading(false));
  }, []);

  const create = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const { data } = await api.post('/courses', { title: newTitle.trim() });
      setCourses(p => [data, ...p]);
      setNewTitle('');
      setShowCreate(false);
      toast.success('Course created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setCreating(false);
    }
  };

  const viewStudents = async (c) => {
    setViewCourse(c);
    const { data } = await api.get(`/courses/${c._id}/students`).catch(() => ({ data: [] }));
    setStudents(data);
  };

  const mine = courses;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={TEACHER_NAV} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Courses" />
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">My Courses</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{mine.length} course{mine.length !== 1 ? 's' : ''}</p>
            </div>
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5">
              <Plus size={14} /> New Course
            </Button>
          </div>

          <CourseList courses={mine} loading={loading} />

          {!loading && mine.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-4">Student Rosters</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mine.map(c => (
                  <button
                    key={c._id}
                    onClick={() => viewStudents(c)}
                    className="text-left p-4 rounded-2xl border border-border bg-card hover:border-violet-800/40 hover:shadow-[0_0_20px_-8px_rgba(139,92,246,0.3)] transition-all duration-200 group"
                  >
                    <p className="text-sm font-medium text-foreground group-hover:text-violet-300 transition-colors">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{c.enrolledStudents?.length || 0} enrolled</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        </main>
      </div>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent onClose={() => setShowCreate(false)}>
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && create()}
              placeholder="e.g. Introduction to Computer Science"
              autoFocus
            />
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button size="sm" onClick={create} disabled={!newTitle.trim() || creating}>
              {creating ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Students dialog */}
      <Dialog open={!!viewCourse} onOpenChange={() => setViewCourse(null)}>
        <DialogContent onClose={() => setViewCourse(null)}>
          <DialogHeader>
            <DialogTitle>{viewCourse?.title}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {students.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No students enrolled</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {students.map(s => (
                  <div key={s._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors">
                    <Avatar name={s.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                    </div>
                    <OnlineDot isOnline={s.isOnline} />
                  </div>
                ))}
              </div>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherCourses;
