const mongoose = require('mongoose');

const internalMarkSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  component: { type: String, required: true },
  marks: { type: Number, required: true },
  maxMarks: { type: Number, default: 25 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InternalMark', internalMarkSchema);
