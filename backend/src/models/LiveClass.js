const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended'],
    default: 'scheduled',
  },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LiveClass', liveClassSchema);
