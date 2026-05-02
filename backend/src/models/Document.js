const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    fileData: { type: String }, // Base64 encoded file content
    fileName: { type: String },
    fileType: { type: String },
    fileUrl: { type: String }, // Keep for backward compatibility/external links
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['SYLLABUS', 'ASSIGNMENT', 'STUDY_MATERIAL', 'UNIVERSITY_POLICY'], default: 'STUDY_MATERIAL' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);