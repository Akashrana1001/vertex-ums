import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  MessageCircle,
  X
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { normalizeRole } from '../lib/auth';

const starterPrompts = [
  'Why choose this college?',
  'College Features',
  'Overview',
  'My Courses',
  'Announcements',
  'Assignments',
  'Exam Schedule',
  'My Marks',
  'Discussion',
  'Study Materials',
  'Placements'
];

const includesAny = (source, words) => words.some((word) => source.includes(word));

const roleLabel = (role) => {
  if (role === 'TEACHER') return 'teacher';
  if (role === 'STUDENT') return 'student';
  return 'student/teacher';
};

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const HomeChatbot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = useMemo(() => normalizeRole(user?.role), [user?.role]);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: createId(),
      role: 'assistant',
      text:
        "Hi! I am your UMS guide. Ask me where to find announcements, study materials, placements, courses, or a sample rank."
    }
  ]);
  const scrollerRef = useRef(null);

  const routeByRole = (teacherRoute, studentRoute, guestRoute = '/login') => {
    if (role === 'TEACHER') return teacherRoute;
    if (role === 'STUDENT') return studentRoute;
    return guestRoute;
  };

  const scrollToBottom = () => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const openHashSection = (hash) => {
    if (!hash) return;
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.location.hash = hash;
  };

  const handleAction = (action) => {
    if (!action) return;
    if (action.type === 'route') {
      navigate(action.target);
      return;
    }
    if (action.type === 'hash') {
      openHashSection(action.target);
      return;
    }
  };

  const buildReply = (rawText) => {
    const text = rawText.toLowerCase().trim();

    if (includesAny(text, ['announcement', 'announcements', 'notice', 'update'])) {
      return {
        text: `You can open announcements from the ${roleLabel(role)} side menu. New announcements are real-time in UMS.`,
        actions: [
          {
            label: role === 'TEACHER' ? 'Open Teacher Announcements' : role === 'STUDENT' ? 'Open Student Announcements' : 'Sign In to Open',
            type: 'route',
            target: routeByRole('/teacher/announcements', '/student/announcements')
          }
        ]
      };
    }

    if (includesAny(text, ['assignment', 'assignments', 'homework'])) {
      return {
        text: 'Assignments can be found in the Assignments section, where you can submit your work and view grades.',
        actions: [
          {
            label: 'Open Assignments',
            type: 'route',
            target: routeByRole('/teacher/assignments', '/student/assignments')
          }
        ]
      };
    }

    if (includesAny(text, ['exam', 'schedule', 'timetable'])) {
      return {
        text: 'Exam schedules and regular timetables are available in their respective sections.',
        actions: [
          {
            label: 'Open Exam Schedule',
            type: 'route',
            target: routeByRole('/teacher/exams', '/student/exams')
          }
        ]
      };
    }

    if (includesAny(text, ['discussion', 'forum', 'chat'])) {
      return {
        text: 'Join the Discussion forums to chat with peers and teachers in real-time.',
        actions: [
          {
            label: 'Open Discussions',
            type: 'route',
            target: routeByRole('/teacher/discussion', '/student/discussion')
          }
        ]
      };
    }

    if (includesAny(text, ['overview', 'dashboard', 'home'])) {
      return {
        text: 'Your overview dashboard gives you a summary of your recent activities.',
        actions: [
          {
            label: 'Open Dashboard',
            type: 'route',
            target: routeByRole('/teacher/dashboard', '/student/dashboard')
          }
        ]
      };
    }

    if (includesAny(text, ['study material', 'materials', 'document', 'notes', 'slides', 'resource'])) {
      return {
        text: 'Study resources are available in Study Materials. Students can download notes there.',
        actions: [
          {
            label: role === 'TEACHER' ? 'Open Teacher Resources' : role === 'STUDENT' ? 'Open Student Study Materials' : 'Sign In to Open',
            type: 'route',
            target: routeByRole('/teacher/resources', '/student/documents')
          }
        ]
      };
    }

    if (includesAny(text, ['placement', 'placements', 'job', 'company', 'drive'])) {
      return {
        text: 'Placement drives, company names, status, package, visit date, and deadlines are in Placements.',
        actions: [
          {
            label: role === 'TEACHER' ? 'Open Teacher Placements' : role === 'STUDENT' ? 'Open Student Placements' : 'Sign In to Open',
            type: 'route',
            target: routeByRole('/teacher/placements', '/student/placements')
          }
        ]
      };
    }

    if (includesAny(text, ['rank', 'sample rank', 'topper', 'mark', 'marks', 'grade'])) {
      return {
        text:
          'Use My Marks to see your percentage, grades, and performance.',
        actions: [
          {
            label: role === 'TEACHER' ? 'Open Marks & Grades' : role === 'STUDENT' ? 'Open My Marks' : 'Sign In to Open',
            type: 'route',
            target: routeByRole('/teacher/marks', '/student/marks')
          }
        ]
      };
    }

    if (includesAny(text, ['attendance', 'mark present', 'present', 'session'])) {
      return {
        text:
          'Attendance is real-time. Teachers start/stop sessions and students get a live modal to mark present instantly.',
        actions: [
          {
            label: role === 'TEACHER' ? 'Open Teacher Attendance' : role === 'STUDENT' ? 'Open Student Dashboard' : 'Sign In to Open',
            type: 'route',
            target: routeByRole('/teacher/attendance', '/student/dashboard')
          }
        ]
      };
    }

    if (includesAny(text, ['course', 'courses', 'enroll', 'subject'])) {
      return {
        text: 'Courses are managed from the Courses page. Students can check enrolled courses and teachers manage class lists.',
        actions: [
          {
            label: role === 'TEACHER' ? 'Open Teacher Courses' : role === 'STUDENT' ? 'Open My Courses' : 'Sign In to Open',
            type: 'route',
            target: routeByRole('/teacher/courses', '/student/courses')
          }
        ]
      };
    }

    if (
      includesAny(text, ['how university', 'university good', 'why university', 'why vertex', 'why choose', 'this college', 'why college', 'college features', 'features']) ||
      (includesAny(text, ['university', 'college']) && includesAny(text, ['good', 'best', 'strong']))
    ) {
      return {
        text:
          'Vertex UMS is an excellent choice because it combines real-time attendance, live announcements, role-based dashboards, interactive learning modes, and top-tier placement opportunities all in one innovative platform.',
        actions: [
          { label: 'See Features', type: 'hash', target: '#features' },
          { label: 'See Programs', type: 'hash', target: '#programs' },
          { label: 'See Testimonials', type: 'hash', target: '#testimonials' }
        ]
      };
    }

    if (includesAny(text, ['where', 'find', 'see', 'things'])) {
      return {
        text:
          'Quick guide: Announcements, Courses, Study Materials, Placements, and Marks are all in the dashboard sidebar after login.',
        actions: [
          { label: 'Open Dashboard', type: 'route', target: routeByRole('/teacher/dashboard', '/student/dashboard') },
          { label: 'Open Announcements', type: 'route', target: routeByRole('/teacher/announcements', '/student/announcements') },
          { label: 'Open Study Materials', type: 'route', target: routeByRole('/teacher/resources', '/student/documents') }
        ]
      };
    }

    return {
      text:
        'I can help with announcements, study materials, placements, attendance, courses, and marks. Try one of the quick prompts below.',
      actions: [
        { label: 'Announcements', type: 'route', target: routeByRole('/teacher/announcements', '/student/announcements') },
        { label: 'Placements', type: 'route', target: routeByRole('/teacher/placements', '/student/placements') },
        { label: 'University Features', type: 'hash', target: '#features' }
      ]
    };
  };

  const submitMessage = (questionText) => {
    const trimmed = questionText.trim();
    if (!trimmed) return;

    const userMessage = { id: createId(), role: 'user', text: trimmed };
    const answer = buildReply(trimmed);
    const botMessage = { id: createId(), role: 'assistant', ...answer };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[60]">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="chat-open"
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-[calc(100vw-2rem)] sm:w-96 h-[34rem] max-h-[80vh] rounded-3xl border border-blue-400/20 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-blue-900/30 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-800 bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-emerald-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">UMS Assistant</p>
                    <p className="text-[11px] text-slate-300">Live guide for campus navigation</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div ref={scrollerRef} className="h-[22.5rem] overflow-y-auto px-3.5 py-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={
                      message.role === 'user'
                        ? 'max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 text-white px-3.5 py-2.5 text-sm'
                        : 'max-w-[88%] rounded-2xl rounded-bl-md bg-slate-900 border border-slate-800 text-slate-100 px-3.5 py-2.5 text-sm'
                    }
                  >
                    <p>{message.text}</p>
                    {message.actions?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        {message.actions.map((action) => (
                          <button
                            key={`${message.id}-${action.label}`}
                            type="button"
                            onClick={() => handleAction(action)}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-3.5 pb-3 bg-slate-950/95 sticky bottom-0">
              <div className="flex overflow-x-auto gap-2 mb-2.5 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shrink-0">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => submitMessage(prompt)}
                    className="whitespace-nowrap text-[11px] rounded-full border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 px-2.5 py-1 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 p-2 rounded-2xl border border-slate-700 bg-slate-900/70">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      submitMessage(input);
                    }
                  }}
                  placeholder="Ask: where are announcements?"
                  className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => submitMessage(input)}
                  className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="group flex items-center gap-2.5 rounded-2xl border border-blue-400/30 bg-slate-950/90 hover:bg-slate-900 text-white px-4 py-3 shadow-2xl shadow-blue-900/25 backdrop-blur-xl"
          aria-label="Open UMS assistant chat"
        >
          <span className="relative w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/35 text-blue-300 flex items-center justify-center">
            <MessageCircle size={18} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold">UMS Chatbot</span>
            <span className="text-[11px] text-slate-400">Ask where to find anything</span>
          </span>
        </motion.button>
      )}
    </div>
  );
};

export default HomeChatbot;
