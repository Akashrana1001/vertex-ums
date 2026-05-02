import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { getDashboardPath } from '../lib/auth';

const Orb = ({ className }) => (
  <div className={`absolute rounded-full blur-[120px] opacity-20 pointer-events-none ${className}`} />
);

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(getDashboardPath(data.user.role) || '/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col flex-1 relative bg-[#0d0d10] justify-between p-12 overflow-hidden border-r border-white/[0.05]">
        <Orb className="w-[500px] h-[500px] bg-primary -top-40 -left-40" />
        <Orb className="w-[400px] h-[400px] bg-[#6d4dff] bottom-0 -right-20" />
        <div className="bg-grid absolute inset-0 opacity-40" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-[#6d4dff] rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-semibold text-white text-sm">Vertex University</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs text-[#cdc2ff] bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full">
            <Sparkles size={11} />
            Real-time academic platform
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Your campus,<br />
            <span className="text-gradient">digitized.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-sm">
            Live attendance, instant announcements, and real-time dashboards — all in one place for teachers and students.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              ['12,000+', 'Students'],
              ['340+', 'Courses'],
              ['98%', 'Uptime'],
              ['&lt;200ms', 'Live events']
            ].map(([v, l]) => (
              <div key={l} className="glass rounded-xl p-4">
                <p className="text-xl font-bold text-white" dangerouslySetInnerHTML={{ __html: v }} />
                <p className="text-xs text-muted-foreground mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground">
          © 2026 Vertex University. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <Orb className="w-[400px] h-[400px] bg-primary top-0 right-0 lg:hidden" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-[#6d4dff] rounded-xl flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-semibold text-white text-sm">Vertex UMS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Sign in</h1>
            <p className="text-muted-foreground text-sm mt-1.5">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email address</label>
              <Input
                type="email"
                required
                value={form.email}
                onChange={set('email')}
                placeholder="you@university.edu"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 mt-2" size="lg">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Sign In <ArrowRight size={16} /></>
              }
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:brightness-110 font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
