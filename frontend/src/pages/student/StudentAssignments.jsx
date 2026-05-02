import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, Upload, CheckCircle, ExternalLink } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogBody } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { SkeletonList } from '../../components/SkeletonLoader';
import { STUDENT_NAV } from '../../config/navConfig';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Particles from '../../components/Particles';

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const item = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const StudentAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitTarget, setSubmitTarget] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/assignments'), api.get('/courses')]).then(([a, c]) => {
      const enrolled = c.data.filter(course => course.enrolledStudents?.some(s => (s._id || s) === user?.id));
      const ids = enrolled.map(c => c._id);
      setEnrolledCourseIds(ids);
      setAssignments(a.data.filter(asgn => ids.includes(asgn.courseId?._id || asgn.courseId)));
    }).finally(() => setLoading(false));
  }, [user]);

  const getMySubmission = (asgn) =>
    asgn.submissions?.find(s => (s.studentId?._id || s.studentId) === user?.id);

  const submit = async () => {
    if (!submitUrl.trim()) return toast.error('Please provide a file link');
    setSubmitting(submitTarget._id);
    try {
      const { data } = await api.post(`/assignments/${submitTarget._id}/submit`, { fileUrl: submitUrl });
      setAssignments(p => p.map(a => a._id === submitTarget._id ? data : a));
      setSubmitTarget(null);
      setSubmitUrl('');
      toast.success('Assignment submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setSubmitting(null); }
  };

  const isOverdue = (dueDate) => dueDate && new Date(dueDate) < new Date();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={STUDENT_NAV} />
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
          <div>
            <h2 className="text-sm font-semibold text-foreground">My Assignments</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{assignments.length} assignment{assignments.length !== 1 ? 's' : ''} from enrolled courses</p>
          </div>

          {loading ? <SkeletonList /> : assignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ClipboardList size={40} className="text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No assignments yet. Check back after enrolling in courses.</p>
            </div>
          ) : (
            <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
              {assignments.map(a => {
                const mySubmission = getMySubmission(a);
                const overdue = isOverdue(a.dueDate);
                return (
                  <motion.div key={a._id} variants={item}>
                    <Card className={`transition-colors ${mySubmission ? 'border-emerald-800/40' : overdue ? 'border-red-800/40' : ''}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-xl border shrink-0 ${mySubmission ? 'bg-emerald-600/15 border-emerald-600/20 text-emerald-400' : 'bg-primary/15 border-primary/20 text-primary'}`}>
                            {mySubmission ? <CheckCircle size={16} /> : <ClipboardList size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-foreground">{a.title}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {a.courseId?.title || 'Course'} · {a.teacherId?.name || 'Teacher'}
                                </p>
                              </div>
                              {mySubmission ? (
                                <Badge variant="secondary" className="text-[10px] text-emerald-400 border-emerald-800/40 shrink-0">
                                  {mySubmission.grade ? `Graded: ${mySubmission.grade}` : 'Submitted'}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className={`text-[10px] shrink-0 ${overdue ? 'text-red-400 border-red-800/40' : 'text-orange-400 border-orange-800/40'}`}>
                                  {overdue ? 'Overdue' : 'Pending'}
                                </Badge>
                              )}
                            </div>

                            {a.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{a.description}</p>}

                            <div className="flex items-center gap-4 mt-3 flex-wrap">
                              {a.dueDate && (
                                <span className={`flex items-center gap-1 text-xs ${overdue && !mySubmission ? 'text-red-400' : 'text-muted-foreground'}`}>
                                  <Clock size={11} /> Due {new Date(a.dueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                </span>
                              )}
                              {a.fileUrl && (
                                <a href={a.fileUrl} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                                  <ExternalLink size={11} /> Download
                                </a>
                              )}
                            </div>

                            {mySubmission ? (
                              <div className="mt-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30">
                                <p className="text-xs text-emerald-400 font-medium mb-1">Your Submission</p>
                                <a href={mySubmission.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-violet-400 hover:underline truncate block">{mySubmission.fileUrl}</a>
                                {mySubmission.feedback && <p className="text-xs text-muted-foreground mt-1">Feedback: {mySubmission.feedback}</p>}
                              </div>
                            ) : !overdue && (
                              <Button size="sm" className="mt-3 gap-1.5 text-xs" onClick={() => setSubmitTarget(a)}>
                                <Upload size={12} /> Submit
                              </Button>
                            )}
                          </div>
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

      <Dialog open={!!submitTarget} onOpenChange={() => setSubmitTarget(null)}>
        <DialogContent onClose={() => setSubmitTarget(null)}>
          <DialogHeader><DialogTitle>Submit: {submitTarget?.title}</DialogTitle></DialogHeader>
          <DialogBody className="space-y-3">
            <p className="text-xs text-muted-foreground">Paste your submission link (Google Drive, GitHub, etc.)</p>
            <Input
              value={submitUrl}
              onChange={e => setSubmitUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              autoFocus
            />
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setSubmitTarget(null)}>Cancel</Button>
            <Button size="sm" onClick={submit} disabled={!!submitting}>{submitting ? 'Submitting…' : 'Submit'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentAssignments;
