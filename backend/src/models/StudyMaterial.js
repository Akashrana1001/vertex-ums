const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  fileUrl: { type: String, required: true },
  type: {
    type: String,
    enum: ['notes', 'slides', 'reference', 'video'],
    default: 'notes',
  },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
