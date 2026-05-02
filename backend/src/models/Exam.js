const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  duration: Number,
  room: String,
  totalMarks: { type: Number, default: 100 },
  type: {
    type: String,
    enum: ['midterm', 'final', 'quiz', 'practical'],
    default: 'midterm',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Exam', examSchema);
