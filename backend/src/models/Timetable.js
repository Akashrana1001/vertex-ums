const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true,
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Timetable', timetableSchema);
