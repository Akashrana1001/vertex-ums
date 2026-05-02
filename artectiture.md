# Architecture Document — UMS Capstone

## 1. Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, Framer Motion, Recharts, Socket.io-client |
| Backend | Node.js, Express.js, Socket.io |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| State | React Context API (no Redux) |

---

## 2. Directory Structure (Monorepo)

```
ums-capstone/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js              # Axios instance with JWT interceptor
│   │   ├── components/               # Reusable UI
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   └── OnlineDot.jsx
│   │   ├── features/
│   │   │   ├── attendance/
│   │   │   │   ├── AttendanceModal.jsx       # Student: auto-pop modal
│   │   │   │   ├── AttendanceManager.jsx     # Teacher: start/stop + live counter
│   │   │   │   └── AttendanceChart.jsx       # Recharts bar chart
│   │   │   ├── announcements/
│   │   │   │   ├── AnnouncementComposer.jsx  # Teacher: post form
│   │   │   │   └── AnnouncementFeed.jsx      # Student: live feed + toast
│   │   │   └── courses/
│   │   │       ├── CourseCard.jsx
│   │   │       └── CourseList.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # JWT, user object, login/logout
│   │   │   └── SocketContext.jsx      # socket instance, connection state
│   │   ├── hooks/
│   │   │   ├── useAuth.js             # Consumes AuthContext
│   │   │   └── useSocket.js           # Consumes SocketContext
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── teacher/
│   │   │   │   ├── TeacherDashboard.jsx
│   │   │   │   ├── TeacherAttendance.jsx
│   │   │   │   ├── TeacherAnnouncements.jsx
│   │   │   │   └── TeacherCourses.jsx
│   │   │   └── student/
│   │   │       ├── StudentDashboard.jsx
│   │   │       ├── StudentCourses.jsx
│   │   │       └── StudentAnnouncements.jsx
│   │   ├── guards/
│   │   │   ├── TeacherRoute.jsx       # Redirects non-teachers
│   │   │   └── StudentRoute.jsx       # Redirects non-students
│   │   └── App.jsx                    # React Router v6 routes
│   ├── index.html
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Course.js
    │   │   ├── Announcement.js
    │   │   └── Attendance.js
    │   ├── routes/
    │   │   ├── auth.js                # POST /api/auth/register, /login
    │   │   ├── courses.js             # GET/POST /api/courses
    │   │   └── announcements.js       # GET /api/announcements
    │   ├── middleware/
    │   │   └── authMiddleware.js      # JWT verify middleware
    │   ├── sockets/
    │   │   └── socketHandlers.js      # All socket.io event handlers
    │   └── server.js                  # Express + Socket.io entry point
    └── package.json
```

---

## 3. Database Schemas (Mongoose)

### User.js
```js
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },   // bcrypt hashed
  role: { type: String, enum: ['STUDENT', 'TEACHER'], required: true },
  isOnline: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

### Course.js
```js
{
  title: { type: String, required: true },
  teacherId: { type: ObjectId, ref: 'User', required: true },
  enrolledStudents: [{ type: ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
}
```

### Announcement.js
```js
{
  teacherId: { type: ObjectId, ref: 'User', required: true },
  courseId: { type: ObjectId, ref: 'Course' },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}
```

### Attendance.js
```js
{
  courseId: { type: ObjectId, ref: 'Course', required: true },
  teacherId: { type: ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  presentStudents: [{ type: ObjectId, ref: 'User' }],
  isOpen: { type: Boolean, default: false }
}
```

---

## 4. REST API Endpoints (Thin — No Heavy Logic)

### Auth Routes (`/api/auth`)
| Method | Path | Description |
|---|---|---|
| POST | `/register` | Create user, return JWT |
| POST | `/login` | Validate credentials, return JWT |

### Course Routes (`/api/courses`) — JWT required
| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/` | Any | Get all courses |
| POST | `/` | TEACHER | Create a course |
| GET | `/:id/students` | TEACHER | Get enrolled students |
| POST | `/:id/enroll` | STUDENT | Enroll self in course |

### Announcement Routes (`/api/announcements`) — JWT required
| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/` | Any | Get all announcements |

---

## 5. WebSocket Event Dictionary

All socket connections must send a JWT in the handshake auth:
```js
const socket = io(SERVER_URL, { auth: { token: localStorage.getItem('token') } });
```

### Connection & Auth
| Direction | Event | Payload | Description |
|---|---|---|---|
| Client → Server | `authenticate` | `{ token }` | Bind socket to userId in server map |
| Server → All | `userStatusUpdate` | `{ userId, isOnline }` | Broadcast when any user connects/disconnects |

### Attendance System
| Direction | Event | Payload | Description |
|---|---|---|---|
| Teacher → Server | `startAttendance` | `{ courseId }` | Opens attendance session, broadcasts to students |
| Server → Students | `attendanceOpened` | `{ courseId, courseName }` | Triggers auto-pop modal on student UI |
| Student → Server | `markPresent` | `{ courseId, studentId }` | Student marks themselves present |
| Server → Teacher | `attendanceUpdate` | `{ courseId, presentCount, studentId }` | Live counter update on teacher UI |
| Teacher → Server | `stopAttendance` | `{ courseId }` | Closes session |
| Server → Students | `attendanceClosed` | `{ courseId }` | Auto-dismisses student modal |

### Announcements
| Direction | Event | Payload | Description |
|---|---|---|---|
| Teacher → Server | `postAnnouncement` | `{ content, courseId }` | Server saves to DB, broadcasts to students |
| Server → Students | `newAnnouncement` | `{ content, teacherName, timestamp }` | Triggers toast + adds to feed |

---

## 6. Frontend State Architecture

```
App.jsx
├── AuthContext (user, token, login, logout)
└── SocketContext (socket instance, isConnected)
    ├── TeacherDashboard
    │   ├── useSocket() → listens to attendanceUpdate, userStatusUpdate
    │   └── AttendanceManager → emits startAttendance, stopAttendance
    └── StudentDashboard
        ├── useSocket() → listens to attendanceOpened, newAnnouncement
        └── AttendanceModal → emits markPresent
```

---

## 7. Security & RBAC

### Backend
- JWT middleware on all routes except `/api/auth/*`
- Socket.io middleware validates JWT on handshake; disconnects unauthorized clients
- Role is read from JWT payload; checked per route/event handler

### Frontend
```jsx
// TeacherRoute.jsx
const TeacherRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'TEACHER') return <Navigate to="/student/dashboard" />;
  return children;
};
```
- Same pattern for `StudentRoute`
- React Router v6 `<Outlet />` pattern for nested protected layouts

---

## 8. Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ums
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 9. Key npm Packages

### Backend
```json
"express", "mongoose", "socket.io", "jsonwebtoken", "bcryptjs", "cors", "dotenv"
```

### Frontend
```json
"react", "react-router-dom", "socket.io-client", "axios",
"tailwindcss", "framer-motion", "recharts", "react-hot-toast", "lucide-react"
```




the mongouri = mongodb://rishab:test@ac-8cyisaw-shard-00-00.qdxm359.mongodb.net:27017,ac-8cyisaw-shard-00-01.qdxm359.mongodb.net:27017,ac-8cyisaw-shard-00-02.qdxm359.mongodb.net:27017/?ssl=true&replicaSet=atlas-y7r5sw-shard-0&authSource=admin&appName=Cluster0

