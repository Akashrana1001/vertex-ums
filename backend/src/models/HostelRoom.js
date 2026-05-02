const mongoose = require('mongoose');

const hostelRoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  floor: Number,
  capacity: { type: Number, required: true },
  type: {
    type: String,
    enum: ['single', 'double', 'triple'],
    default: 'double',
  },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['available', 'full'],
    default: 'available',
  },
});

module.exports = mongoose.model('HostelRoom', hostelRoomSchema);
