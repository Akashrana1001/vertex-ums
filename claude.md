# Claude Code Instructions — UMS Capstone Project

## Your Role
You are building a **University Management System (UMS)** capstone project using the **MERN stack + Socket.io**. This is a frontend-heavy project. Spend **80% effort on the React frontend** and keep the backend minimal.

## Golden Rules
1. **Stack is locked**: MongoDB + Mongoose, Express.js, React (Vite), Node.js, Socket.io. No other major libraries unless UI-related (e.g., Tailwind, shadcn/ui, Framer Motion, Recharts).
2. **Backend = thin API layer only**: Simple CRUD routes + Socket.io event emitters. No heavy business logic, no complex middleware chains, no microservices.
3. **Frontend = rich, interactive, real-time**: Every meaningful action should feel alive. Use WebSockets for live updates. Animate transitions. Show loading states. Use toasts, modals, badges, counters.
4. **RBAC is strict**: Teachers and Students have completely separate dashboards, routes, and socket event access. Never mix them.
5. **Monorepo structure**: Follow the directory layout in `architecture.md` exactly.

## What You SHOULD Do
- Build feature-rich React pages with reusable components
- Use `SocketContext` to share the socket instance across the app
- Use `AuthContext` for JWT storage and role-based routing
- Implement all WebSocket events from the event dictionary in `architecture.md`
- Use Recharts or Chart.js for analytics/dashboard charts
- Use Framer Motion for page transitions and modal animations
- Use React Hot Toast or Sonner for real-time notifications
- Protect routes using `<TeacherRoute>` and `<StudentRoute>` HOC guards
- Show real-time online/offline status for users
- Build a fully functional live attendance flow (teacher starts → student marks → teacher sees counter update live)

## What You MUST NOT Do
- Do NOT add GraphQL, tRPC, Redis, or any non-MERN technology
- Do NOT write complex backend algorithms or ML logic
- Do NOT skip socket event handlers — every event in the dictionary must be implemented
- Do NOT use class components — functional components + hooks only
- Do NOT hardcode user data — everything comes from MongoDB via API or socket

## File Generation Order
When scaffolding the project, always follow this order:
1. `backend/src/models/` — Mongoose schemas first
2. `backend/src/routes/` — Auth + data routes
3. `backend/src/sockets/` — Socket event handlers
4. `backend/src/server.js` — Wire everything together
5. `frontend/src/context/` — AuthContext, SocketContext
6. `frontend/src/hooks/` — useAuth, useSocket
7. `frontend/src/components/` — Shared UI components
8. `frontend/src/features/` — Attendance, Chat, Announcements
9. `frontend/src/pages/` — Full dashboard pages
10. `frontend/src/App.jsx` — Routing + guards

## Code Style
- Use `async/await` everywhere, no raw `.then()` chains
- Use named exports for components, default export for pages
- All API calls go through a central `src/api/axios.js` instance with JWT interceptor
- Socket listeners are registered in `useEffect` and cleaned up on unmount
- Keep component files under 200 lines; extract sub-components if needed