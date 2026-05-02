const express = require('express');
const router = express.Router();
const Placement = require('../models/Placement');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

// Get all visiting companies
router.get('/', protect, async (req, res) => {
    try {
        const placements = await Placement.find().sort({ visitDate: 1 });
        res.json(placements);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new visiting company (Teachers / Placement Coordinators only)
router.post('/', protect, teacherOnly, async (req, res) => {
    try {
        const newPlacement = await Placement.create(req.body);
        res.status(201).json(newPlacement);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;