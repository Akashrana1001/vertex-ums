# Product Requirements Document — UMS Capstone

## 1. Executive Summary
The **University Management System (UMS)** is a real-time, role-based web application that connects teachers and students in a live, interactive academic environment. Built as a capstone project on the MERN stack with Socket.io, it prioritizes a rich frontend experience where every action — attendance, announcements, grades, chats — is reflected instantly across all connected clients.

---

## 2. User Personas & RBACwha

### 👨‍🏫 Teacher
- Can log in via `/login` and is redirected to `/teacher/dashboard`
- Has full control over courses, attendance sessions, and announcements
- Sees live counters and real-time student activity
- Cannot access any `/student/*` routes

### 👨‍🎓 Student
- Can log in via `/login` and is redirected to `/student/dashboard`
- Can view courses, mark attendance when a session is open, and receive announcements
- Sees a personalized dashboard with their attendance %, upcoming events, grades
- Cannot access any `/teacher/*` routes

---

## 3. Feature List

### 🔐 Authentication Module
- JWT-based login/register
- Role selection during registration (STUDENT / TEACHER)
- Protected routes enforced on both frontend (React Router guards) and backend (JWT middleware)
- Auto-redirect based on role after login
- Token stored in localStorage, attached to every API call via Axios interceptor

---

### 📊 Teacher Dashboard
- **Overview Cards**: Total students enrolled, active courses, announcements posted, pending attendance sessions
- **Live Activity Feed**: Real-time list of students who just came online (via `userStatusUpdate` socket event)
- **Attendance Manager**:
  - Start/Stop attendance for a specific course
  - Live counter showing how many students have marked present (updates without refresh)
  - View attendance history per course with a bar chart
- **Announcement Board**:
  - Rich text announcement composer
  - Post announcement → instantly pushed to all enrolled students via socket
  - List of past announcements with timestamps
- **Course Manager**:
  - Create and list courses
  - View enrolled students per course
- **Analytics Panel**:
  - Attendance rate per course (Recharts LineChart or BarChart)
  - Student engagement over time

---

### 🎓 Student Dashboard
- **Overview Cards**: Enrolled courses count, overall attendance %, unread announcements, upcoming sessions
- **Live Attendance Modal**:
  - When teacher starts attendance, a modal auto-pops up (triggered by `attendanceOpened` socket event)
  - Student clicks "Mark Present" button inside modal
  - Modal closes automatically when session ends
- **Announcement Feed**:
  - Toast notification pops when a new announcement arrives (via `newAnnouncement` socket event)
  - Full announcement list with read/unread state
- **My Courses**:
  - List of enrolled courses with teacher name, schedule
  - Per-course attendance percentage shown as a progress bar
- **Online Status Indicator**:
  - Green dot next to teacher name when teacher is online

---

### 💬 Real-Time Features Summary (WebSocket Driven)
| Feature                   | Trigger                           | Who Sees It                           |
| ------------------------- | --------------------------------- | ------------------------------------- |
| Attendance session opens  | Teacher clicks "Start Attendance" | All enrolled students get a modal     |
| Student marks present     | Student clicks button in modal    | Teacher sees live counter increment   |
| New announcement posted   | Teacher submits announcement form | All students get a toast notification |
| User comes online/offline | Socket connects/disconnects       | Relevant peers see status dot update  |

---

## 4. Non-Functional Requirements
- **Responsiveness**: All pages must be mobile-responsive (Tailwind breakpoints)
- **Performance**: Socket events should reflect in UI within 200ms
- **UX**: Every async action must show a loading spinner or skeleton
- **Animations**: Page transitions and modal open/close must be animated (Framer Motion)
- **Notifications**: Use toast notifications for all real-time events (React Hot Toast)

---

## 5. Out of Scope (for this capstone)
- Video conferencing
- Email notifications
- Admin super-user role