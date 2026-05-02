require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const courseRoutes = require('./routes/courses');
const announcementRoutes = require('./routes/announcements');
const documentRoutes = require('./routes/documents');
const placementRoutes = require('./routes/placements');
const assignmentRoutes = require('./routes/assignments');
const examRoutes = require('./routes/exams');
const markRoutes = require('./routes/marks');
const internalMarkRoutes = require('./routes/internal-marks');
const timetableRoutes = require('./routes/timetable');
const feeRoutes = require('./routes/fees');
const libraryRoutes = require('./routes/library');
const feedbackRoutes = require('./routes/feedback');
const discussionRoutes = require('./routes/discussion');
const liveClassRoutes = require('./routes/live-classes');
const syllabusRoutes = require('./routes/syllabus');
const calendarRoutes = require('./routes/calendar');
const certificateRoutes = require('./routes/certificates');
const hostelRoutes = require('./routes/hostel');
const transportRoutes = require('./routes/transport');
const grievanceRoutes = require('./routes/grievances');
const eventRoutes = require('./routes/events');
const notificationRoutes = require('./routes/notifications');
const studyMaterialRoutes = require('./routes/study-materials');
const userRoutes = require('./routes/users');
const socketHandlers = require('./sockets/socketHandlers');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://vertex-ums-u3si.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

const io = new Server(server, {
  cors: { origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/internal-marks', internalMarkRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/discussion', discussionRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/users', userRoutes);

socketHandlers(io);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
