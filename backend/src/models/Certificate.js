const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['bonafide', 'transcript', 'degree', 'noc', 'other'],
    required: true,
  },
  purpose: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: String,
});

module.exports = mongoose.model('Certificate', certificateSchema);
