const mongoose = require('mongoose');

const transportRegistrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transport', required: true },
  stop: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TransportRegistration', transportRegistrationSchema);
