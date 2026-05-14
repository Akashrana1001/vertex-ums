import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, BarChart2, User } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { SkeletonList } from '../../components/SkeletonLoader';
import { TEACHER_NAV } from '../../config/navConfig';
import useAuth from '../../hooks/useAuth';
import useSocket from '../../hooks/useSocket';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Particles from '../../components/Particles';

const gradeFromPercent = (p) => {
  if (p >= 90) return 'A+';
  if (p >= 80) return 'A';
  if (p >= 70) return 'B';
  if (p >= 60) return 'C';
  if (p >= 50) return 'D';
  return 'F';
};

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const item = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const TeacherMarks = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [marks, setMarks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentId: '', courseId: '', examId: '', marks: '', maxMarks: 100, remarks: '' });
  const [saving, setSaving] = useState(false);
  const [filterCourse, setFilterCourse] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/marks'),
      api.get('/courses'),
      api.get('/exams'),
      api.get('/users/students'),
    ]).then(([m, c, e, s]) => {
      setMarks(m.data);
      setCourses(c.data);
      setExams(e.data);
      setStudents(s.data || []);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onUpdate = (m) => setMarks(p => {
      const idx = p.findIndex(x => x._id === m._id);
      return idx >= 0 ? p.map((x, i) => i === idx ? m : x) : [m, ...p];
    });
    socket.on('updateMark', onUpdate);
    return () => socket.off('updateMark', onUpdate);
  }, [socket]);

  const save = async () => {
    if (!form.studentId || !form.courseId || form.marks === '') return toast.error('Student, course and marks required');
    setSaving(true);
    try {
      const pct = Math.round((form.marks / form.maxMarks) * 100);
      const grade = gradeFromPercent(pct);
      const { data } = await api.post('/marks', { ...form, grade });
      setMarks(p => {
        const idx = p.findIndex(m => m._id === data._id);
        return idx >= 0 ? p.map((m, i) => i === idx ? data : m) : [data, ...p];
      });
      setShowForm(false);
      setForm({ studentId: '', courseId: '', examId: '', marks: '', maxMarks: 100, remarks: '' });
      toast.success('Marks saved');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const filtered = filterCourse ? marks.filter(m => (m.courseId?._id || m.courseId) === filterCourse) : marks;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={TEACHER_NAV} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Marks & Grades" />
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
              <h2 className="text-sm font-semibold text-foreground">Student Marks</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)}
                className="h-8 px-3 text-xs rounded-xl bg-input border border-border text-foreground focus:outline-none">
                <option value="">All Courses</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
              <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5">
                <Plus size={14} /> Add Marks
              </Button>
            </div>
          </div>

          {loading ? <SkeletonList /> : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BarChart2 size={40} className="text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No marks recorded yet.</p>
            </div>
          ) : (
            <Card>
              <CardHeader><CardTitle>Marks Register</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-xs text-muted-foreground font-medium">Student</th>
                        <th className="text-left p-4 text-xs text-muted-foreground font-medium">Course</th>
                        <th className="text-left p-4 text-xs text-muted-foreground font-medium">Exam</th>
                        <th className="text-center p-4 text-xs text-muted-foreground font-medium">Marks</th>
                        <th className="text-center p-4 text-xs text-muted-foreground font-medium">Grade</th>
                        <th className="text-left p-4 text-xs text-muted-foreground font-medium">Remarks</th>
                      </tr>
                    </thead>
                    <motion.tbody variants={stagger} initial="initial" animate="animate">
                      {filtered.map(m => (
                        <motion.tr key={m._id} variants={item} className="border-b border-border/50 hover:bg-accent/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                {(m.studentId?.name || 'S')[0].toUpperCase()}
                              </div>
                              <span className="text-foreground font-medium">{m.studentId?.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">{m.courseId?.title || '—'}</td>
                          <td className="p-4 text-muted-foreground text-xs">{m.examId?.title || '—'}</td>
                          <td className="p-4 text-center">
                            <span className="font-semibold text-foreground">{m.marks}</span>
                            <span className="text-muted-foreground text-xs">/{m.maxMarks}</span>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant={m.grade === 'F' ? 'destructive' : 'secondary'} className="text-[10px]">
                              {m.grade || gradeFromPercent(Math.round((m.marks / m.maxMarks) * 100))}
                            </Badge>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground">{m.remarks || '—'}</td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        </main>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent onClose={() => setShowForm(false)}>
          <DialogHeader><DialogTitle>Add / Update Marks</DialogTitle></DialogHeader>
          <DialogBody className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Student *</label>
              <select value={form.studentId} onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))}
                className="w-full h-9 px-3 text-sm rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select student</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Course *</label>
              <select value={form.courseId} onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))}
                className="w-full h-9 px-3 text-sm rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select course</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Exam (optional)</label>
              <select value={form.examId} onChange={e => setForm(p => ({ ...p, examId: e.target.value }))}
                className="w-full h-9 px-3 text-sm rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">None</option>
                {exams.filter(e => !form.courseId || (e.courseId?._id || e.courseId) === form.courseId).map(e => (
                  <option key={e._id} value={e._id}>{e.title}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Marks Obtained *</label>
                <Input type="number" value={form.marks} onChange={e => setForm(p => ({ ...p, marks: e.target.value }))} placeholder="e.g. 78" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Out Of</label>
                <Input type="number" value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))} />
              </div>
            </div>
            {form.marks !== '' && (
              <p className="text-xs text-muted-foreground">
                Grade: <span className="font-semibold text-foreground">{gradeFromPercent(Math.round((form.marks / form.maxMarks) * 100))}</span>
                {' '}({Math.round((form.marks / form.maxMarks) * 100)}%)
              </p>
            )}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Remarks</label>
              <Input value={form.remarks} onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))} placeholder="Optional remarks" />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button size="sm" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Marks'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherMarks;
