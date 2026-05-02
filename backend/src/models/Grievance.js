const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: ['academic', 'hostel', 'transport', 'administrative', 'other'],
    default: 'other',
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['open', 'in-review', 'resolved', 'closed'],
    default: 'open',
  },
  resolution: String,
  resolvedAt: Date,
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Grievance', grievanceSchema);
