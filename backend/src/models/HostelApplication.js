const mongoose = require('mongoose');

const hostelApplicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  preferredType: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'HostelRoom' },
  appliedAt: { type: Date, default: Date.now },
  processedAt: Date,
  remarks: String,
});

module.exports = mongoose.model('HostelApplication', hostelApplicationSchema);
