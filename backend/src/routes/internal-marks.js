const express = require('express');
const InternalMark = require('../models/InternalMark');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” TEACHER: all, STUDENT: own
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'STUDENT') {
      filter.studentId = req.user.id;
    } else if (req.query.userId) {
      filter.studentId = req.query.userId;
    }
    if (req.query.courseId) filter.courseId = req.query.courseId;
    const marks = await InternalMark.find(filter)
      .populate('studentId', 'name email')
      .populate('courseId', 'title')
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” TEACHER only
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can enter internal marks' });
    }
    const mark = await InternalMark.create({ ...req.body, teacherId: req.user.id });
    res.status(201).json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id â€” TEACHER only
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can update internal marks' });
    }
    const mark = await InternalMark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mark) return res.status(404).json({ message: 'Internal mark not found' });
    res.json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


