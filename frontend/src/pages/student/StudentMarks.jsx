import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Award } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { StatCard } from '../../components/StatCard';
import { SkeletonList, SkeletonCard } from '../../components/SkeletonLoader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STUDENT_NAV } from '../../config/navConfig';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import Particles from '../../components/Particles';

const GRADE_COLORS = { 'A+': '#22c55e', A: '#10b981', B: '#3b82f6', C: '#f59e0b', D: '#f97316', F: '#ef4444' };

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const item = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const StudentMarks = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/marks').then(r => setMarks(r.data.filter(m => (m.studentId?._id || m.studentId) === user?.id)))
      .finally(() => setLoading(false));
  }, [user]);

  const avg = marks.length > 0
    ? Math.round(marks.reduce((s, m) => s + (m.marks / m.maxMarks) * 100, 0) / marks.length)
    : 0;

  const best = marks.length > 0
    ? marks.reduce((b, m) => (m.marks / m.maxMarks) > (b.marks / b.maxMarks) ? m : b, marks[0])
    : null;

  const chartData = marks.map(m => ({
    name: m.examId?.title || m.courseId?.title || 'Exam',
    percent: Math.round((m.marks / m.maxMarks) * 100),
    grade: m.grade,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs">
        <p className="text-foreground font-medium">{payload[0]?.payload?.name}</p>
        <p className="text-muted-foreground">{payload[0]?.value}% · Grade {payload[0]?.payload?.grade}</p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar links={STUDENT_NAV} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="My Marks" />
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
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <motion.div variants={stagger} initial="initial" animate="animate"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div variants={item}>
                <StatCard title="Average Score" value={`${avg}%`} icon={TrendingUp} color="violet" />
              </motion.div>
              <motion.div variants={item}>
                <StatCard title="Total Exams" value={marks.length} icon={BarChart2} color="blue" />
              </motion.div>
              <motion.div variants={item}>
                <StatCard title="Best Grade" value={best ? best.grade || 'A' : '—'} icon={Award} color="emerald" />
              </motion.div>
            </motion.div>
          )}

          {!loading && marks.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Performance Chart</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barSize={28}>
                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                    <Bar dataKey="percent" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={GRADE_COLORS[entry.grade] || '#8b5cf6'} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {loading ? <SkeletonList /> : marks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BarChart2 size={40} className="text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No marks recorded yet.</p>
            </div>
          ) : (
            <Card>
              <CardHeader><CardTitle>Marks Breakdown</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-xs text-muted-foreground font-medium">Course</th>
                        <th className="text-left p-4 text-xs text-muted-foreground font-medium">Exam</th>
                        <th className="text-center p-4 text-xs text-muted-foreground font-medium">Marks</th>
                        <th className="text-center p-4 text-xs text-muted-foreground font-medium">%</th>
                        <th className="text-center p-4 text-xs text-muted-foreground font-medium">Grade</th>
                        <th className="text-left p-4 text-xs text-muted-foreground font-medium">Remarks</th>
                      </tr>
                    </thead>
                    <motion.tbody variants={stagger} initial="initial" animate="animate">
                      {marks.map(m => {
                        const pct = Math.round((m.marks / m.maxMarks) * 100);
                        const grade = m.grade || (pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F');
                        return (
                          <motion.tr key={m._id} variants={item} className="border-b border-border/50 hover:bg-accent/40 transition-colors">
                            <td className="p-4 text-foreground font-medium text-xs">{m.courseId?.title || '—'}</td>
                            <td className="p-4 text-muted-foreground text-xs">{m.examId?.title || 'General'}</td>
                            <td className="p-4 text-center">
                              <span className="font-semibold text-foreground">{m.marks}</span>
                              <span className="text-muted-foreground text-xs">/{m.maxMarks}</span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-xs font-medium text-foreground">{pct}%</span>
                                <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: GRADE_COLORS[grade] || '#8b5cf6' }} />
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <Badge variant="secondary" className="text-[10px]" style={{ color: GRADE_COLORS[grade] }}>
                                {grade}
                              </Badge>
                            </td>
                            <td className="p-4 text-xs text-muted-foreground">{m.remarks || '—'}</td>
                          </motion.tr>
                        );
                      })}
                    </motion.tbody>
                  </table>
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

export default StudentMarks;
