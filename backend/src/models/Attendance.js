const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  presentStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isOpen: { type: Boolean, default: false }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
