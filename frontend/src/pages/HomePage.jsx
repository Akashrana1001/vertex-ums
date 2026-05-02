import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, BookOpen, Users, Award, ArrowRight, Globe,
  Shield, Zap, BarChart2, MessageSquare, CalendarCheck, ChevronRight,
  Star, Clock, Building2, FlaskConical
} from 'lucide-react';
import PixelBlast from '../components/PixelBlast';
import HomeChatbot from '../components/HomeChatbot';
import useAuth from '../hooks/useAuth';
import { getDashboardPath } from '../lib/auth';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay }
});

const stats = [
  { value: '12,000+', label: 'Students Enrolled', icon: Users, color: 'blue' },
  { value: '340+', label: 'Courses Offered', icon: BookOpen, color: 'violet' },
  { value: '98%', label: 'Attendance Accuracy', icon: CalendarCheck, color: 'emerald' },
  { value: '150+', label: 'Faculty Members', icon: Award, color: 'orange' }
];

const features = [
  {
    icon: Zap,
    title: 'Real-Time Attendance',
    desc: 'Teachers open sessions with one click. Students mark present instantly. Live counters update for faculty as responses come in.',
    color: 'blue'
  },
  {
    icon: MessageSquare,
    title: 'Live Announcements',
    desc: "Post course-wide announcements that land as toast notifications on every enrolled student's screen — no refresh needed.",
    color: 'violet'
  },
  {
    icon: BarChart2,
    title: 'Analytics Dashboard',
    desc: 'Track attendance rates, student engagement, and course performance with interactive charts powered by Recharts.',
    color: 'emerald'
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    desc: "JWT-secured routes ensure teachers and students each see only what they're supposed to. No overlap, no leakage.",
    color: 'orange'
  },
  {
    icon: Globe,
    title: 'Online Presence',
    desc: "See who's live right now. Green status dots update in real time as users connect and disconnect via WebSocket.",
    color: 'pink'
  },
  {
    icon: CalendarCheck,
    title: 'Course Enrollment',
    desc: "Students browse and enroll in available courses. Teachers manage their class rosters with full visibility into who's in.",
    color: 'cyan'
  }
];

const programs = [
  { icon: FlaskConical, name: 'Science & Technology', courses: 84, color: 'blue' },
  { icon: BarChart2, name: 'Business & Economics', courses: 62, color: 'emerald' },
  { icon: BookOpen, name: 'Arts & Humanities', courses: 48, color: 'violet' },
  { icon: Globe, name: 'Social Sciences', courses: 56, color: 'orange' },
  { icon: Building2, name: 'Engineering', courses: 91, color: 'pink' },
  { icon: Award, name: 'Law & Governance', courses: 37, color: 'yellow' }
];

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Professor of Computer Science',
    quote: "The live attendance system has completely transformed how I run lectures. I can see who's present in real time without any paperwork.",
    rating: 5
  },
  {
    name: 'Arjun Mehta',
    role: 'Final Year Student',
    quote: 'The auto-popup attendance modal means I never miss marking. The announcements feed keeps me updated on everything from my teachers.',
    rating: 5
  },
  {
    name: 'Prof. Nalini Rao',
    role: 'Head of Department',
    quote: 'The analytics panel gives our department a clear picture of engagement trends across all courses. Excellent tool for academic oversight.',
    rating: 5
  }
];

const colorMap = {
  blue: { bg: 'bg-blue-600/15', border: 'border-blue-600/30', icon: 'text-blue-400', badge: 'bg-blue-900/40 text-blue-300' },
  violet: { bg: 'bg-violet-600/15', border: 'border-violet-600/30', icon: 'text-violet-400', badge: 'bg-violet-900/40 text-violet-300' },
  emerald: { bg: 'bg-emerald-600/15', border: 'border-emerald-600/30', icon: 'text-emerald-400', badge: 'bg-emerald-900/40 text-emerald-300' },
  orange: { bg: 'bg-orange-600/15', border: 'border-orange-600/30', icon: 'text-orange-400', badge: 'bg-orange-900/40 text-orange-300' },
  pink: { bg: 'bg-pink-600/15', border: 'border-pink-600/30', icon: 'text-pink-400', badge: 'bg-pink-900/40 text-pink-300' },
  cyan: { bg: 'bg-cyan-600/15', border: 'border-cyan-600/30', icon: 'text-cyan-400', badge: 'bg-cyan-900/40 text-cyan-300' },
  yellow: { bg: 'bg-yellow-600/15', border: 'border-yellow-600/30', icon: 'text-yellow-400', badge: 'bg-yellow-900/40 text-yellow-300' }
};

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const dashboardPath = getDashboardPath(user?.role);
    navigate(dashboardPath || '/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/70 bg-black/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/30">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-wide">Vertex University</span>
              <span className="hidden sm:inline text-muted-foreground text-xs ml-2">Management System</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#programs" className="hover:text-white transition-colors">Programs</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={handleGetStarted}
                className="flex items-center gap-2 bg-primary hover:brightness-110 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary/25"
              >
                Dashboard <ChevronRight size={14} />
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-white transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="text-sm bg-primary hover:brightness-110 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-primary/25">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* PixelBlast background */}
        <div className="absolute inset-0 z-0">
          <PixelBlast
            variant="circle"
            pixelSize={4}
            color="#3b82f6"
            patternScale={2.5}
            patternDensity={0.9}
            pixelSizeJitter={0}
            enableRipples
            rippleSpeed={0.35}
            rippleThickness={0.14}
            rippleIntensityScale={1.8}
            liquid={false}
            speed={0.4}
            edgeFade={0.3}
            transparent
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/45 to-black" />

        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/20 border border-primary/35 text-[#cdc2ff] text-xs font-medium px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Now with real-time WebSocket attendance
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Where Knowledge
            <br />
            <span className="bg-gradient-to-r from-white via-[#c7bbff] to-primary bg-clip-text text-transparent">
              Meets Innovation
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Vertex University's smart management platform connects teachers and students
            in a live, interactive academic environment — attendance, announcements, and
            analytics all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2.5 bg-primary hover:brightness-110 text-white font-semibold px-8 py-4 rounded-2xl text-base shadow-lg shadow-primary/35 transition-colors"
            >
              Get Started
              <ArrowRight size={18} />
            </motion.button>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 border border-border hover:border-white/30 text-muted-foreground hover:text-white font-medium px-8 py-4 rounded-2xl text-base transition-colors"
            >
              Explore Features
            </a>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-slate-600 text-xs"
        >
          <div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-1.5 bg-slate-500 rounded-full"
            />
          </div>
          Scroll to explore
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => {
              const c = colorMap[s.color];
              return (
                <motion.div key={s.label} {...fadeUp(i * 0.08)}
                  className={`${c.bg} border ${c.border} rounded-2xl p-6 text-center`}
                >
                  <div className={`inline-flex p-3 ${c.bg} border ${c.border} rounded-xl mb-3`}>
                    <s.icon size={22} className={c.icon} />
                  </div>
                  <p className="text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">Platform Features</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-4">Everything in One Dashboard</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built on MERN + Socket.io, every interaction is real-time. No page reloads.
              No delays. Just live academic management.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              return (
                <motion.div key={f.title} {...fadeUp(i * 0.07)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 group transition-colors"
                >
                  <div className={`inline-flex p-3 ${c.bg} border ${c.border} rounded-xl mb-4`}>
                    <f.icon size={20} className={c.icon} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Programs ── */}
      <section id="programs" className="py-24 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-violet-400 text-sm font-semibold tracking-wider uppercase">Academic Programs</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-4">Explore Our Schools</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From engineering to the arts, Vertex offers comprehensive programs managed
              seamlessly through the UMS platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map((p, i) => {
              const c = colorMap[p.color];
              return (
                <motion.div key={p.name} {...fadeUp(i * 0.07)}
                  whileHover={{ y: -4 }}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 flex items-center gap-4 cursor-default transition-all"
                >
                  <div className={`flex-shrink-0 p-3 ${c.bg} border ${c.border} rounded-xl`}>
                    <p.icon size={22} className={c.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">{p.name}</h3>
                    <p className="text-slate-500 text-sm mt-0.5">{p.courses} courses available</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 flex-shrink-0" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase">Workflow</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-4">How Attendance Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              The complete real-time attendance flow from start to finish — powered by Socket.io.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { step: '01', icon: Users, title: 'Teacher Logs In', desc: 'Authenticated via JWT, routed to the Teacher Dashboard.', color: 'blue' },
              { step: '02', icon: Zap, title: 'Opens Session', desc: 'Clicks "Start Attendance" — socket broadcasts to all enrolled students.', color: 'violet' },
              { step: '03', icon: CalendarCheck, title: 'Students Mark', desc: 'A modal auto-pops on student screens. One click marks them present.', color: 'emerald' },
              { step: '04', icon: BarChart2, title: 'Live Counter', desc: 'Teacher sees the present count increment in real time. Session closes on demand.', color: 'orange' }
            ].map((s, i) => {
              const c = colorMap[s.color];
              return (
                <motion.div key={s.step} {...fadeUp(i * 0.1)} className="relative">
                  {i < 3 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-px border-t border-dashed border-slate-700 z-0" />
                  )}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-xs font-bold ${c.icon}`}>{s.step}</span>
                      <div className={`p-2 ${c.bg} border ${c.border} rounded-lg`}>
                        <s.icon size={16} className={c.icon} />
                      </div>
                    </div>
                    <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-orange-400 text-sm font-semibold tracking-wider uppercase">Testimonials</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-4">Trusted by Our Community</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeUp(i * 0.1)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div className="border-t border-slate-800 pt-4">
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <PixelBlast
            variant="diamond"
            pixelSize={5}
            color="#7c3aed"
            patternScale={3}
            patternDensity={0.75}
            enableRipples={false}
            speed={0.25}
            edgeFade={0.4}
            transparent
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-slate-950/90 z-10" />

        <div className="relative z-20 max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp()}>
            <div className="inline-flex bg-primary p-4 rounded-2xl mb-6 shadow-lg shadow-primary/30">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5">
              Ready to Join Vertex University?
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Whether you're a student tracking your journey or a teacher managing your classroom —
              the UMS platform gives you the tools you need, live.
            </p>
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 bg-primary hover:brightness-110 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-2xl shadow-primary/40 transition-colors"
            >
              {user ? 'Go to Dashboard' : "Get Started — It's Free"}
              <ArrowRight size={20} />
            </motion.button>
            {!user && (
              <p className="text-slate-600 text-sm mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:brightness-110">Sign in</Link>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl">
                <GraduationCap size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Vertex University</p>
                <p className="text-slate-500 text-xs">Management System — Built with MERN + Socket.io</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-slate-500 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#programs" className="hover:text-white transition-colors">Programs</a>
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <Clock size={12} />
              <span>© 2026 Vertex University. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      <HomeChatbot />
    </div>
  );
};

export default HomePage;
