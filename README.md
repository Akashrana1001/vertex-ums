# 🎓 Vertex University Management System (UMS)

<div align="center">
  <img alt="MERN Stack" src="https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb" />
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="Socket.io" src="https://img.shields.io/badge/Socket.io-Real--Time-black?style=for-the-badge&logo=socket.io" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-Animations-f012be?style=for-the-badge&logo=framer" />
</div>

<br />

The **University Management System (UMS)** is a cutting-edge, real-time, role-based web application designed to bridge the gap between teachers and students in a live, interactive academic environment. 

Built as an advanced capstone project using the **MERN stack** (MongoDB, Express, React, Node.js) and powered by **Socket.io**, the platform prioritizes an immersive frontend experience. Every crucial action—from live attendance tracking and course announcements to real-time status updates—is instantly reflected across all connected clients without requiring page reloads.

---

## ✨ Core Features

### 🔐 Strict Role-Based Access Control (RBAC)
- **Teacher & Student Personas:** Completely isolated dashboard experiences ensuring no data leakage or overlapping functionalities.
- **JWT-Secured Routes:** Robust protection on both the frontend (React Router guards) and backend (JWT middlewares).

### ⚡ Real-Time Attendance Engine
- **One-Click Session Start:** Teachers can open attendance sessions that instantly broadcast to all enrolled students.
- **Live Auto-Pop Modals:** Students receive a non-intrusive, auto-popping modal on their screens to mark themselves present.
- **Live Counters:** Teachers watch their attendance counts increment in real time via WebSockets.
- **Analytics:** Visualize past attendance records and engagement trends via interactive **Recharts**.

### 📢 Instant Course Announcements
- **Rich Broadcasts:** Teachers post course-wide announcements.
- **Toast Notifications:** Students receive live, toast-based notifications the second an announcement is published.

### 🟢 Online Status & Live Activity Feed
- **WebSocket Presence:** A green status dot next to user profiles updates seamlessly when they come online or disconnect.
- **Live Teacher Feed:** Teachers have a live dashboard feed capturing recent student online activity.

### 🎨 Stunning, Modern UI
- **Immersive Backgrounds:** Features interactive Canvas/WebGL-based backgrounds (e.g., PixelBlast & OGL Particles).
- **Framer Motion Transitions:** Silky smooth page transitions, list staggering, and interactive micro-animations.
- **Tailwind CSS Styling:** Fully responsive, dark-mode-first aesthetic with a high-end "DevTools" appeal.

---

## 🛠️ Technology Stack

Our architecture is heavily frontend-focused, designed with a "thin backend" and a rich, highly interactive React application.

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS, shadcn/ui inspired layouts
- **Animations:** Framer Motion, OGL (for 3D particle effects)
- **Real-Time:** Socket.io-client
- **Data Visualization:** Recharts
- **State Management:** React Context API (AuthContext, SocketContext)
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Real-Time:** Socket.io
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing

---

## 📂 Project Architecture

The project follows a clean **Monorepo** structure, ensuring maintainability and scalability.

```text
ums-capstone/
├── frontend/                 # Rich, interactive React application
│   ├── src/
│   │   ├── api/              # Axios instance with JWT interceptors
│   │   ├── components/       # Reusable UI (Navbars, Modals, Particles, etc.)
│   │   ├── context/          # AuthContext & SocketContext
│   │   ├── features/         # Domain-specific modules (attendance, courses, announcements)
│   │   ├── guards/           # Route protection (TeacherRoute, StudentRoute)
│   │   ├── hooks/            # Custom hooks (useAuth, useSocket)
│   │   └── pages/            # Full page layouts (TeacherDashboard, StudentDashboard)
│   └── package.json
│
└── backend/                  # Thin, robust Express/Node.js API layer
    ├── src/
    │   ├── models/           # Mongoose Schemas (User, Course, Attendance, Announcement)
    │   ├── routes/           # RESTful endpoints
    │   ├── middleware/       # Auth validation middlewares
    │   ├── sockets/          # Centralized Socket.io event handlers
    │   └── server.js         # Application entry point
    └── package.json
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ums-capstone.git
cd ums-capstone
```

### 2. Environment Setup

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://rishab:test@ac-8cyisaw-shard-00-00.qdxm359.mongodb.net:27017,ac-8cyisaw-shard-00-01.qdxm359.mongodb.net:27017,ac-8cyisaw-shard-00-02.qdxm359.mongodb.net:27017/?ssl=true&replicaSet=atlas-y7r5sw-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Installation & Running

Open two separate terminals to run the backend and frontend concurrently.

**Terminal 1: Backend**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2: Frontend**
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 🔌 WebSocket Event Dictionary

The application leverages highly efficient, real-time Socket.io events. Every connection requires a valid JWT for authentication.

| Event Name | Direction | Description |
|---|---|---|
| `userStatusUpdate` | Server → All | Broadcasts live when any user connects or disconnects. |
| `startAttendance` | Teacher → Server | Initiates a live attendance session for a specific course. |
| `attendanceOpened` | Server → Students | Auto-triggers the attendance modal on student interfaces. |
| `markPresent` | Student → Server | Submits the student's presence to the active session. |
| `attendanceUpdate` | Server → Teacher | Live updates the teacher's active present counter. |
| `postAnnouncement` | Teacher → Server | Pushes a new announcement to a specific course. |
| `newAnnouncement` | Server → Students | Triggers a live toast notification on the student's screen. |

---

## 🤝 Contributing

This project was developed as a Capstone project. However, contributions, issues, and feature requests are always welcome! 

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">
  <i>Crafted with passion for modern web architecture and seamless user experiences.</i>
</p>
