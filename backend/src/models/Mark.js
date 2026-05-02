const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  marks: { type: Number, required: true },
  maxMarks: { type: Number, default: 100 },
  grade: String,
  remarks: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mark', markSchema);
