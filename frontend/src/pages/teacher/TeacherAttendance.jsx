import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Play, Square, Save } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/Avatar';
import { SkeletonList } from '../../components/SkeletonLoader';
import { TEACHER_NAV } from '../../config/navConfig';
import useAuth from '../../hooks/useAuth';
import useSocket from '../../hooks/useSocket';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Particles from '../../components/Particles';

const todayStr = () => new Date().toISOString().split('T')[0];

const TeacherAttendance = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [present, setPresent] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const [monthRecords, setMonthRecords] = useState([]);

  // Load teacher's courses (backend filters to current teacher only)
  useEffect(() => {
    api.get('/courses').then(r => {
      setCourses(r.data);
      if (r.data.length > 0) setSelectedCourse(r.data[0]._id);
    }).finally(() => setLoading(false));
  }, []);

  // Load enrolled students when course changes
  useEffect(() => {
    if (!selectedCourse) { setStudents([]); return; }
    setStudentsLoading(true);
    api.get(`/courses/${selectedCourse}/students`)
      .then(r => setStudents(r.data || []))
      .catch(() => setStudents([]))
      .finally(() => setStudentsLoading(false));
  }, [selectedCourse]);

  // Load existing attendance record for selected course + date
  useEffect(() => {
    if (!selectedCourse || !selectedDate) return;
    api.get(`/attendance?courseId=${selectedCourse}&date=${selectedDate}`)
      .then(r => {
        const rec = r.data[0];
        setPresent(rec ? new Set(rec.presentStudents.map(s => s._id || s)) : new Set());
      })
      .catch(() => setPresent(new Set()));
  }, [selectedCourse, selectedDate]);

  // Load monthly records for summary
  useEffect(() => {
    if (!selectedCourse || !selectedDate) return;
    const [year, month] = selectedDate.split('-');
    api.get(`/attendance/month?courseId=${selectedCourse}&year=${year}&month=${month}`)
      .then(r => setMonthRecords(r.data || []))
      .catch(() => setMonthRecords([]));
  }, [selectedCourse, selectedDate]);

  // Live session socket listener
  useEffect(() => {
    if (!socket) return;
    const onUpdate = ({ courseId, presentCount }) => {
      if (courseId === selectedCourse) setLiveCount(presentCount);
    };
    socket.on('attendanceUpdate', onUpdate);
    return () => socket.off('attendanceUpdate', onUpdate);
  }, [socket, selectedCourse]);

  const toggle = (id) => setPresent(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const markAll = () => setPresent(new Set(students.map(s => s._id)));
  const clearAll = () => setPresent(new Set());

  const save = async () => {
    if (!selectedCourse) return toast.error('Select a course first');
    setSaving(true);
    try {
      await api.post('/attendance', {
        courseId: selectedCourse,
        date: selectedDate,
        presentStudents: [...present],
      });
      toast.success(`Attendance saved — ${present.size}/${students.length} present`);
      const [year, month] = selectedDate.split('-');
      const r = await api.get(`/attendance/month?courseId=${selectedCourse}&year=${year}&month=${month}`);
      setMonthRecords(r.data || []);
    } catch { toast.error('Failed to save attendance'); }
    finally { setSaving(false); }
  };

  const startLive = () => {
    if (!selectedCourse) return toast.error('Select a course first');
    socket?.emit('startAttendance', { courseId: selectedCourse });
    setIsLive(true);
    setLiveCount(0);
    toast.success('Live attendance session started');
  };

  const stopLive = () => {
    socket?.emit('stopAttendance', { courseId: selectedCourse });
    setIsLive(false);
    toast('Session stopped');
  };

  const courseName = courses.find(c => c._id === selectedCourse)?.title || '';
  const totalDays = monthRecords.length;
  const studentStats = students.map(s => ({
    ...s,
    days: monthRecords.filter(r =>
      r.presentStudents.some(p => String(p._id || p) === String(s._id))
    ).length,
  }));
  const displayDate = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={TEACHER_NAV} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="Attendance" />
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

          {/* Controls bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[180px]">
                  <label className="text-xs text-muted-foreground mb-1.5 block">Course</label>
                  <select
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                    className="w-full h-9 px-3 text-sm rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Select course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="h-9 w-44"
                  />
                </div>
                <div className="flex gap-2">
                  {isLive ? (
                    <Button variant="destructive" size="sm" onClick={stopLive} className="gap-1.5">
                      <Square size={12} /> Stop Live
                      <Badge variant="secondary" className="text-[10px] ml-1">{liveCount}</Badge>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={startLive}
                      disabled={!selectedCourse}
                      className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                    >
                      <Radio size={12} className="animate-pulse" /> Live Session
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student checklist */}
          {loading ? <SkeletonList /> : !selectedCourse ? (
            <div className="text-center py-20 text-muted-foreground text-sm">
              No courses found. Create a course first.
            </div>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-sm">{courseName}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{displayDate}</p>
                    <p className="text-xs text-emerald-400 font-medium mt-0.5">{present.size} / {students.length} present</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={markAll}>Mark All</Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={clearAll}>Clear All</Button>
                    <Button size="sm" className="h-7 text-xs gap-1.5" onClick={save} disabled={saving || !selectedCourse}>
                      <Save size={11} /> {saving ? 'Saving…' : 'Save Attendance'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {studentsLoading ? (
                  <div className="p-5"><SkeletonList rows={4} /></div>
                ) : students.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No students enrolled in this course yet.
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {students.map((s, i) => {
                      const isPresent = present.has(s._id);
                      return (
                        <motion.div
                          key={s._id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.25 }}
                          className={`flex items-center gap-3 px-5 py-3 cursor-pointer select-none transition-colors ${isPresent ? 'bg-emerald-950/25' : 'hover:bg-accent/40'}`}
                          onClick={() => toggle(s._id)}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${isPresent ? 'bg-emerald-500 border-emerald-500' : 'border-border bg-transparent'}`}>
                            {isPresent && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <Avatar name={s.name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                          </div>
                          <Badge
                            variant={isPresent ? 'secondary' : 'outline'}
                            className={`text-[10px] shrink-0 transition-colors ${isPresent ? 'text-emerald-400 border-emerald-900/60 bg-emerald-950/30' : 'text-muted-foreground'}`}
                          >
                            {isPresent ? 'Present' : 'Absent'}
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Monthly attendance summary */}
          {studentStats.length > 0 && totalDays > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Monthly Summary — {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  <span className="text-xs text-muted-foreground font-normal ml-2">({totalDays} class{totalDays !== 1 ? 'es' : ''} recorded)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {studentStats.map(s => {
                    const pct = totalDays > 0 ? Math.round((s.days / totalDays) * 100) : 0;
                    const color = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
                    const textColor = pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400';
                    return (
                      <div key={s._id} className="flex items-center gap-3 px-5 py-3">
                        <Avatar name={s.name} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{s.name}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">{s.days}/{totalDays}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className={`text-[10px] shrink-0 ${textColor}`}>{pct}%</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherAttendance;
