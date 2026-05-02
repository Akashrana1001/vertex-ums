const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  title: String,
  topics: [String],
});

const syllabusSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  units: [unitSchema],
  fileUrl: String,
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Syllabus', syllabusSchema);
