const express = require('express');
const Timetable = require('../models/Timetable');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” all timetable entries
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;
    const entries = await Timetable.find(filter)
      .populate('courseId', 'title')
      .populate('teacherId', 'name email')
      .sort({ day: 1, startTime: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” TEACHER only
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can create timetable entries' });
    }
    const entry = await Timetable.create({ ...req.body, teacherId: req.user.id });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id â€” TEACHER only
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can update timetable entries' });
    }
    const entry = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!entry) return res.status(404).json({ message: 'Timetable entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /:id â€” TEACHER only
router.delete('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can delete timetable entries' });
    }
    const entry = await Timetable.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Timetable entry not found' });
    res.json({ message: 'Timetable entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


