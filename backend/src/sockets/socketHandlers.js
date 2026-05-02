const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const Announcement = require('../models/Announcement');
const Attendance = require('../models/Attendance');

// userId → socketId map
const onlineUsers = new Map();

const socketHandlers = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user.id;
    onlineUsers.set(userId, socket.id);

    await User.findByIdAndUpdate(userId, { isOnline: true });
    io.emit('userStatusUpdate', { userId, isOnline: true });

    socket.on('startAttendance', async ({ courseId }) => {
      try {
        if (socket.user.role !== 'TEACHER') return;

        let session = await Attendance.findOne({ courseId, isOpen: true });
        if (!session) {
          session = await Attendance.create({
            courseId,
            teacherId: userId,
            presentStudents: [],
            isOpen: true
          });
        }

        const course = await Course.findById(courseId).populate('enrolledStudents');
        const courseName = course?.title || 'Unknown';

        course.enrolledStudents.forEach((student) => {
          const sid = onlineUsers.get(student._id.toString());
          if (sid) {
            io.to(sid).emit('attendanceOpened', { courseId, courseName, sessionId: session._id });
          }
        });
      } catch (err) {
        console.error('startAttendance error:', err.message);
      }
    });

    socket.on('markPresent', async ({ courseId, studentId }) => {
      try {
        if (socket.user.role !== 'STUDENT') return;

        const session = await Attendance.findOne({ courseId, isOpen: true });
        if (!session) return;

        if (!session.presentStudents.includes(studentId)) {
          session.presentStudents.push(studentId);
          await session.save();
        }

        const course = await Course.findById(courseId);
        const teacherSid = onlineUsers.get(course.teacherId.toString());
        if (teacherSid) {
          io.to(teacherSid).emit('attendanceUpdate', {
            courseId,
            presentCount: session.presentStudents.length,
            studentId
          });
        }
      } catch (err) {
        console.error('markPresent error:', err.message);
      }
    });

    socket.on('stopAttendance', async ({ courseId }) => {
      try {
        if (socket.user.role !== 'TEACHER') return;

        await Attendance.findOneAndUpdate({ courseId, isOpen: true }, { isOpen: false });

        const course = await Course.findById(courseId).populate('enrolledStudents');
        course.enrolledStudents.forEach((student) => {
          const sid = onlineUsers.get(student._id.toString());
          if (sid) {
            io.to(sid).emit('attendanceClosed', { courseId });
          }
        });
      } catch (err) {
        console.error('stopAttendance error:', err.message);
      }
    });

    socket.on('postAnnouncement', async ({ content, courseId }) => {
      try {
        if (socket.user.role !== 'TEACHER') return;

        const announcement = await Announcement.create({
          teacherId: userId,
          courseId: courseId || null,
          content
        });

        const course = courseId
          ? await Course.findById(courseId).populate('enrolledStudents')
          : null;

        const payload = {
          _id: announcement._id,
          content,
          teacherName: socket.user.name,
          courseId,
          timestamp: announcement.timestamp
        };

        if (course) {
          course.enrolledStudents.forEach((student) => {
            const sid = onlineUsers.get(student._id.toString());
            if (sid) io.to(sid).emit('newAnnouncement', payload);
          });
        } else {
          socket.broadcast.emit('newAnnouncement', payload);
        }
      } catch (err) {
        console.error('postAnnouncement error:', err.message);
      }
    });

    socket.on('disconnect', async () => {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { isOnline: false });
      io.emit('userStatusUpdate', { userId, isOnline: false });
    });
  });
};

module.exports = socketHandlers;
