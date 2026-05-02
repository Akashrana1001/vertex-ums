import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/Avatar';
import { SkeletonList } from '../../components/SkeletonLoader';
import { STUDENT_NAV } from '../../config/navConfig';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Particles from '../../components/Particles';

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const item = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const StudentDiscussion = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [form, setForm] = useState({ title: '', content: '', courseId: '' });
  const [saving, setSaving] = useState(false);
  const [filterCourse, setFilterCourse] = useState('');

  useEffect(() => {
    Promise.all([api.get('/discussion'), api.get('/courses')]).then(([d, c]) => {
      const enrolled = c.data.filter(course =>
        course.enrolledStudents?.some(s => (s._id || s) === user?.id)
      );
      setCourses(enrolled);
      const ids = new Set(enrolled.map(c => c._id));
      // Show general posts + course posts for enrolled courses
      setPosts(d.data.filter(p => !p.courseId || ids.has(p.courseId?._id || p.courseId)));
    }).finally(() => setLoading(false));
  }, [user]);

  const create = async () => {
    if (!form.title || !form.content) return toast.error('Title and content required');
    setSaving(true);
    try {
      const { data } = await api.post('/discussion', form);
      setPosts(p => [data, ...p]);
      setShowCreate(false);
      setForm({ title: '', content: '', courseId: '' });
      toast.success('Question posted');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const reply = async (postId) => {
    const content = replyText[postId]?.trim();
    if (!content) return;
    try {
      const { data } = await api.post(`/discussion/${postId}/reply`, { content });
      setPosts(p => p.map(post => post._id === postId ? data : post));
      setReplyText(p => ({ ...p, [postId]: '' }));
    } catch { toast.error('Failed'); }
  };

  const filtered = filterCourse ? posts.filter(p => (p.courseId?._id || p.courseId) === filterCourse) : posts;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={STUDENT_NAV} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Discussion Forum" />
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
              <h2 className="text-sm font-semibold text-foreground">Discussions & Q&A</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} post{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)}
                className="h-8 px-3 text-xs rounded-xl bg-input border border-border text-foreground focus:outline-none">
                <option value="">All Topics</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
              <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5">
                <Plus size={14} /> Ask a Question
              </Button>
            </div>
          </div>

          {loading ? <SkeletonList /> : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <MessageSquare size={40} className="text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No discussions yet. Ask the first question!</p>
            </div>
          ) : (
            <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
              {filtered.map(post => {
                const isOpen = expanded === post._id;
                const courseTitle = courses.find(c => c._id === (post.courseId?._id || post.courseId))?.title;
                const isOwn = (post.authorId?._id || post.authorId) === user?.id;
                return (
                  <motion.div key={post._id} variants={item}>
                    <Card className={isOwn ? 'border-violet-800/40' : ''}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <Avatar name={post.authorId?.name || 'U'} size="sm" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                                {courseTitle && <Badge variant="secondary" className="text-[10px]">{courseTitle}</Badge>}
                                {isOwn && <Badge variant="secondary" className="text-[10px] text-violet-400 border-violet-800/40">You</Badge>}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {post.authorId?.name || 'Unknown'} · {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button onClick={() => setExpanded(isOpen ? null : post._id)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0">
                            {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                          </button>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-3 overflow-hidden">
                              {post.replies?.length > 0 && (
                                <div className="space-y-2 pl-4 border-l-2 border-border">
                                  {post.replies.map((r, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <Avatar name={r.authorId?.name || 'U'} size="xs" />
                                      <div className="flex-1 bg-secondary/40 rounded-xl px-3 py-2">
                                        <p className="text-xs font-medium text-foreground">{r.authorId?.name || 'User'}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{r.content}</p>
                                        <p className="text-[10px] text-muted-foreground/50 mt-1">{new Date(r.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Input
                                  value={replyText[post._id] || ''}
                                  onChange={e => setReplyText(p => ({ ...p, [post._id]: e.target.value }))}
                                  onKeyDown={e => e.key === 'Enter' && reply(post._id)}
                                  placeholder="Write a reply…"
                                  className="h-8 text-xs flex-1"
                                />
                                <Button size="sm" className="h-8 px-3" onClick={() => reply(post._id)}>
                                  <Send size={12} />
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                          <button onClick={() => setExpanded(isOpen ? null : post._id)} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                            <MessageSquare size={11} /> {post.replies?.length || 0} replies
                          </button>
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
          <DialogHeader><DialogTitle>Post a Question</DialogTitle></DialogHeader>
          <DialogBody className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Course (optional)</label>
              <select value={form.courseId} onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))}
                className="w-full h-9 px-3 text-sm rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">General</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Title / Question *</label>
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="What would you like to ask?" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Details *</label>
              <Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Describe your question in detail..." rows={4} />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button size="sm" onClick={create} disabled={saving}>{saving ? 'Posting…' : 'Post Question'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDiscussion;
