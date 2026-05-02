const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  name: String,
  time: String,
});

const transportSchema = new mongoose.Schema({
  routeNumber: { type: String, required: true },
  routeName: { type: String, required: true },
  stops: [stopSchema],
  vehicleNumber: String,
  driver: String,
  contact: String,
  capacity: { type: Number, default: 40 },
});

module.exports = mongoose.model('Transport', transportSchema);
