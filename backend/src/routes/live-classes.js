const express = require('express');
const LiveClass = require('../models/LiveClass');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” all live classes, optional ?courseId filter
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;
    const classes = await LiveClass.find(filter)
      .populate('courseId', 'title')
      .populate('teacherId', 'name email')
      .sort({ scheduledAt: 1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” TEACHER only, create live class
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can create live classes' });
    }
    const liveClass = await LiveClass.create({ ...req.body, teacherId: req.user.id });
    res.status(201).json(liveClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id â€” TEACHER only, update status/details
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can update live classes' });
    }
    const liveClass = await LiveClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!liveClass) return res.status(404).json({ message: 'Live class not found' });
    res.json(liveClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /:id â€” TEACHER only
router.delete('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can delete live classes' });
    }
    const liveClass = await LiveClass.findByIdAndDelete(req.params.id);
    if (!liveClass) return res.status(404).json({ message: 'Live class not found' });
    res.json({ message: 'Live class deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


