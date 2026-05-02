const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: Date,
  returnDate: Date,
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed',
  },
});

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
