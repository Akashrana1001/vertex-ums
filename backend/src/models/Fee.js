const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending',
  },
  dueDate: Date,
  paidDate: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Fee', feeSchema);
