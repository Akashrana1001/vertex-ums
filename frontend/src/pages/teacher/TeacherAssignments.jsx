import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Award, FileText, Clock } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { SkeletonList } from '../../components/SkeletonLoader';
import { TEACHER_NAV } from '../../config/navConfig';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Particles from '../../components/Particles';

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const item = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const TeacherAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', fileUrl: '', courseId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/assignments'), api.get('/courses')]).then(([a, c]) => {
      setAssignments(a.data);
      setCourses(c.data);
    }).finally(() => setLoading(false));
  }, []);

  const create = async () => {
    if (!form.title || !form.courseId) return toast.error('Title and course required');
    setSaving(true);
    try {
      const { data } = await api.post('/assignments', form);
      setAssignments(p => [data, ...p]);
      setShowCreate(false);
      setForm({ title: '', description: '', dueDate: '', fileUrl: '', courseId: '' });
      toast.success('Assignment created');
    } catch { toast.error('Failed to create'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/assignments/${id}`);
      setAssignments(p => p.filter(a => a._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const gradeSubmission = async (assignmentId, studentId, grade, feedback) => {
    try {
      await api.put(`/assignments/${assignmentId}/grade`, { studentId, grade, feedback });
      setAssignments(p => p.map(a => a._id === assignmentId ? {
        ...a,
        submissions: a.submissions.map(s => s.studentId === studentId ? { ...s, grade, feedback } : s)
      } : a));
      toast.success('Graded');
    } catch { toast.error('Failed'); }
  };

  const mine = assignments;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={TEACHER_NAV} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Assignments" />
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
              <h2 className="text-sm font-semibold text-foreground">Manage Assignments</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{mine.length} assignment{mine.length !== 1 ? 's' : ''}</p>
            </div>
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5">
              <Plus size={14} /> New Assignment
            </Button>
          </div>

          {loading ? <SkeletonList /> : mine.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText size={40} className="text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No assignments yet. Create one to get started.</p>
            </div>
          ) : (
            <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
              {mine.map(a => (
                <motion.div key={a._id} variants={item}>
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">{a.title}</h3>
                            <Badge variant="secondary" className="text-[10px] shrink-0">
                              {courses.find(c => c._id === (a.courseId?._id || a.courseId))?.title || 'Course'}
                            </Badge>
                          </div>
                          {a.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{a.description}</p>}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {a.dueDate && (
                              <span className="flex items-center gap-1">
                                <Clock size={11} /> Due {new Date(a.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Award size={11} /> {a.submissions?.length || 0} submission{a.submissions?.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {a.submissions?.length > 0 && (
                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelected(a)}>
                              Review
                            </Button>
                          )}
                          <button onClick={() => remove(a._id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        </main>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent onClose={() => setShowCreate(false)}>
          <DialogHeader><DialogTitle>New Assignment</DialogTitle></DialogHeader>
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
              <label className="text-xs text-muted-foreground mb-1.5 block">Title *</label>
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Lab Report 1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Description</label>
              <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Instructions..." rows={3} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">File / Link</label>
              <Input value={form.fileUrl} onChange={e => setForm(p => ({ ...p, fileUrl: e.target.value }))} placeholder="https://drive.google.com/..." />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Due Date</label>
              <Input type="datetime-local" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button size="sm" onClick={create} disabled={saving}>{saving ? 'Creating…' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submissions Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent onClose={() => setSelected(null)}>
          <DialogHeader><DialogTitle>Submissions — {selected?.title}</DialogTitle></DialogHeader>
          <DialogBody>
            {selected?.submissions?.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No submissions yet</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {selected?.submissions?.map((s, i) => (
                  <div key={i} className="p-3 rounded-xl border border-border bg-secondary/30">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground">{s.studentId?.name || 'Student'}</p>
                      {s.grade && <Badge className="text-[10px]">{s.grade}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{new Date(s.submittedAt).toLocaleString()}</p>
                    {s.fileUrl && <a href={s.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-violet-400 hover:underline block truncate mb-2">{s.fileUrl}</a>}
                    {!s.grade && (
                      <div className="flex gap-2">
                        <Input placeholder="Grade (e.g. A)" className="h-7 text-xs flex-1" id={`grade-${i}`} />
                        <Button size="sm" className="h-7 text-xs" onClick={() => {
                          const g = document.getElementById(`grade-${i}`)?.value;
                          if (g) gradeSubmission(selected._id, s.studentId?._id || s.studentId, g, '');
                        }}>Grade</Button>
                      </div>
                    )}
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

export default TeacherAssignments;
