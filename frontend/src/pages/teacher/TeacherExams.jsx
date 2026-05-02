import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Calendar, Clock, MapPin, BookOpen } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { SkeletonList } from '../../components/SkeletonLoader';
import { TEACHER_NAV } from '../../config/navConfig';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Particles from '../../components/Particles';

const TYPE_COLORS = { midterm: 'blue', final: 'violet', quiz: 'emerald', practical: 'orange' };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const item = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const TeacherExams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', courseId: '', date: '', duration: 60, room: '', totalMarks: 100, type: 'midterm' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/exams'), api.get('/courses')]).then(([e, c]) => {
      setExams(e.data);
      setCourses(c.data);
    }).finally(() => setLoading(false));
  }, []);

  const create = async () => {
    if (!form.title || !form.courseId || !form.date) return toast.error('Title, course and date required');
    setSaving(true);
    try {
      const { data } = await api.post('/exams', form);
      setExams(p => [data, ...p]);
      setShowCreate(false);
      setForm({ title: '', courseId: '', date: '', duration: 60, room: '', totalMarks: 100, type: 'midterm' });
      toast.success('Exam scheduled');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/exams/${id}`);
      setExams(p => p.filter(e => e._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const mine = exams;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={TEACHER_NAV} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Exam Schedule" />
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
              <h2 className="text-sm font-semibold text-foreground">Scheduled Exams</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{mine.length} exam{mine.length !== 1 ? 's' : ''}</p>
            </div>
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5">
              <Plus size={14} /> Schedule Exam
            </Button>
          </div>

          {loading ? <SkeletonList /> : mine.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Calendar size={40} className="text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No exams scheduled yet.</p>
            </div>
          ) : (
            <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mine.map(e => {
                const color = TYPE_COLORS[e.type] || 'violet';
                const courseTitle = courses.find(c => c._id === (e.courseId?._id || e.courseId))?.title || e.courseId?.title || 'Course';
                return (
                  <motion.div key={e._id} variants={item}>
                    <Card className="hover:border-violet-800/40 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary" className={`text-[10px] capitalize ${color === 'blue' ? 'text-blue-400' : color === 'emerald' ? 'text-emerald-400' : color === 'orange' ? 'text-orange-400' : 'text-violet-400'}`}>
                            {e.type}
                          </Badge>
                          <button onClick={() => remove(e._id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{e.title}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                          <BookOpen size={11} /> {courseTitle}
                        </div>
                        <div className="space-y-1.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2"><Calendar size={11} /> {new Date(e.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
                          <div className="flex items-center gap-2"><Clock size={11} /> {new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {e.duration} min</div>
                          {e.room && <div className="flex items-center gap-2"><MapPin size={11} /> {e.room}</div>}
                          <div className="pt-1 font-medium text-foreground">Total Marks: {e.totalMarks}</div>
                        </div>
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

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent onClose={() => setShowCreate(false)}>
          <DialogHeader><DialogTitle>Schedule Exam</DialogTitle></DialogHeader>
          <DialogBody className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Course *</label>
              <select value={form.courseId} onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))}
                className="w-full h-9 px-3 text-sm rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select course</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Exam Title *</label>
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Mid-Term Examination" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full h-9 px-3 text-sm rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  {['midterm', 'final', 'quiz', 'practical'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Total Marks</label>
                <Input type="number" value={form.totalMarks} onChange={e => setForm(p => ({ ...p, totalMarks: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Date & Time *</label>
              <Input type="datetime-local" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Duration (min)</label>
                <Input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Room / Hall</label>
                <Input value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))} placeholder="e.g. Hall A" />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button size="sm" onClick={create} disabled={saving}>{saving ? 'Saving…' : 'Schedule'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherExams;
