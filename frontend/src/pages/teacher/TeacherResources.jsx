import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, FileText, Download } from 'lucide-react';
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
import Particles from  '../../components/Particles.jsx'

const TYPE_COLORS = { notes: 'text-violet-400', slides: 'text-blue-400', reference: 'text-emerald-400', video: 'text-orange-400' };

const TeacherResources = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', fileUrl: '', type: 'notes', courseId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/study-materials'), api.get('/courses')]).then(([m, c]) => {
      setMaterials(m.data);
      setCourses(c.data);
    }).finally(() => setLoading(false));
  }, []);

  const create = async () => {
    if (!form.title || !form.fileUrl || !form.courseId) return toast.error('Title, link and course required');
    setSaving(true);
    try {
      const { data } = await api.post('/study-materials', form);
      setMaterials(p => [data, ...p]);
      setShowCreate(false);
      setForm({ title: '', description: '', fileUrl: '', type: 'notes', courseId: '' });
      toast.success('Material uploaded');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/study-materials/${id}`);
      setMaterials(p => p.filter(m => m._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const mine = materials;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={TEACHER_NAV} />
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Lecture Notes & Materials</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{mine.length} file{mine.length !== 1 ? 's' : ''} uploaded</p>
            </div>
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5">
              <Plus size={14} /> Upload Material
            </Button>
          </div>

          {loading ? <SkeletonList /> : mine.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText size={40} className="text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No study materials uploaded yet.</p>
            </div>
          ) : (
            <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mine.map(m => {
                const courseTitle = courses.find(c => c._id === (m.courseId?._id || m.courseId))?.title;
                return (
                  <motion.div key={m._id} variants={{ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}>
                    <Card className="hover:border-violet-800/40 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg bg-secondary border border-border ${TYPE_COLORS[m.type] || 'text-violet-400'}`}>
                            <FileText size={15} />
                          </div>
                          <div className="flex items-center gap-1">
                            <a href={m.fileUrl} target="_blank" rel="noreferrer" className="p-1.5 text-muted-foreground hover:text-violet-400 transition-colors">
                              <Download size={13} />
                            </a>
                            <button onClick={() => remove(m._id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <h3 className="font-semibold text-foreground text-sm mb-1 truncate">{m.title}</h3>
                        {m.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{m.description}</p>}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className={`text-[10px] capitalize ${TYPE_COLORS[m.type]}`}>{m.type}</Badge>
                          {courseTitle && <Badge variant="secondary" className="text-[10px]">{courseTitle}</Badge>}
                        </div>
                        <p className="text-[10px] text-muted-foreground/50 mt-2">{new Date(m.uploadedAt).toLocaleDateString()}</p>
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
          <DialogHeader><DialogTitle>Upload Study Material</DialogTitle></DialogHeader>
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
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Chapter 3 Notes" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full h-9 px-3 text-sm rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  {['notes', 'slides', 'reference', 'video'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">File Link *</label>
              <Input value={form.fileUrl} onChange={e => setForm(p => ({ ...p, fileUrl: e.target.value }))} placeholder="https://drive.google.com/..." />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Description</label>
              <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button size="sm" onClick={create} disabled={saving}>{saving ? 'Uploading…' : 'Upload'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherResources;
