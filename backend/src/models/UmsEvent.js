const mongoose = require('mongoose');

const umsEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  endDate: Date,
  venue: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  capacity: Number,
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: {
    type: String,
    enum: ['workshop', 'seminar', 'cultural', 'sports', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UmsEvent', umsEventSchema);
