const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

// Get all documents (Students can see public/course docs)
router.get('/', protect, async (req, res) => {
    try {
        const docs = await Document.find().populate('uploadedBy', 'name');
        res.json(docs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new document (Teachers only)
router.post('/', protect, teacherOnly, async (req, res) => {
    try {
        const newDoc = await Document.create({ ...req.body, uploadedBy: req.user._id });
        res.status(201).json(newDoc);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;