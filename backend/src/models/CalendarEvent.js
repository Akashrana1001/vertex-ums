const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  endDate: Date,
  type: {
    type: String,
    enum: ['holiday', 'exam', 'event', 'deadline', 'other'],
    default: 'other',
  },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
