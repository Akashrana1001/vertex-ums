const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    description: { type: String },
    roleOffered: { type: String, required: true },
    package: { type: String }, // e.g. "10 LPA"
    visitDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    eligibleBranches: [{ type: String }],
    status: { type: String, enum: ['UPCOMING', 'ONGOING', 'COMPLETED'], default: 'UPCOMING' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Placement', placementSchema);