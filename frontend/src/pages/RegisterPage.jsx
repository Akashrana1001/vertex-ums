import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, BookOpen, Users2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { getDashboardPath } from '../lib/auth';

const Orb = ({ className }) => (
  <div className={`absolute rounded-full blur-[120px] opacity-15 pointer-events-none ${className}`} />
);

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user);
      toast.success(`Welcome to Vertex, ${data.user.name}!`);
      navigate(getDashboardPath(data.user.role) || '/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <Orb className="w-[500px] h-[500px] bg-primary -top-40 -right-40" />
      <Orb className="w-[400px] h-[400px] bg-[#6d4dff] -bottom-32 -left-32" />
      <div className="bg-grid absolute inset-0 opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-[#6d4dff] rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="font-semibold text-white text-sm">Vertex UMS</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Create account</h1>
          <p className="text-muted-foreground text-sm mt-1.5">Join thousands of students and teachers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { role: 'STUDENT', icon: BookOpen, label: 'Student' },
              { role: 'TEACHER', icon: Users2, label: 'Teacher' }
            ].map(({ role, icon: Icon, label }) => (
              <motion.button
                key={role}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setForm(f => ({ ...f, role }))}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all duration-200',
                  form.role === role
                    ? 'border-primary/60 bg-primary/12 text-[#cec3ff] shadow-[0_0_20px_-8px_rgba(82,39,255,0.5)]'
                    : 'border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground'
                )}
              >
                <Icon size={18} />
                {label}
              </motion.button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Full name</label>
            <Input required value={form.name} onChange={set('name')} placeholder="Jane Smith" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email address</label>
            <Input type="email" required value={form.email} onChange={set('email')} placeholder="you@university.edu" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <Input type="password" required value={form.password} onChange={set('password')} placeholder="At least 8 characters" />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11" size="lg">
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>Create Account <ArrowRight size={16} /></>
            }
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:brightness-110 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
