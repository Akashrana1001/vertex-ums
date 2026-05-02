import {
  Activity, BookOpen, Users, Megaphone, FileText, Briefcase,
  ClipboardList, Calendar, BarChart2, MessageSquare
} from 'lucide-react';

export const TEACHER_NAV = [
  { to: '/teacher/dashboard', label: 'Overview', icon: Activity },
  { to: '/teacher/courses', label: 'Courses', icon: BookOpen },
  { to: '/teacher/attendance', label: 'Attendance', icon: Users },
  { to: '/teacher/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/teacher/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/teacher/exams', label: 'Exams', icon: Calendar },
  { to: '/teacher/marks', label: 'Marks', icon: BarChart2 },
  { to: '/teacher/discussion', label: 'Discussion', icon: MessageSquare },
  { to: '/teacher/resources', label: 'Study Materials', icon: FileText },
  { to: '/teacher/placements', label: 'Placements', icon: Briefcase },
];

export const STUDENT_NAV = [
  { to: '/student/dashboard', label: 'Overview', icon: Activity },
  { to: '/student/courses', label: 'My Courses', icon: BookOpen },
  { to: '/student/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/student/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/student/exams', label: 'Exam Schedule', icon: Calendar },
  { to: '/student/marks', label: 'My Marks', icon: BarChart2 },
  { to: '/student/discussion', label: 'Discussion', icon: MessageSquare },
  { to: '/student/documents', label: 'Study Materials', icon: FileText },
  { to: '/student/placements', label: 'Placements', icon: Briefcase },
];
