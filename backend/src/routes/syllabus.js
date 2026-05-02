const express = require('express');
const Syllabus = require('../models/Syllabus');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” all syllabuses, optional ?courseId filter
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;
    const syllabuses = await Syllabus.find(filter)
      .populate('courseId', 'title')
      .populate('teacherId', 'name email')
      .sort({ updatedAt: -1 });
    res.json(syllabuses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” TEACHER only, create or update syllabus for a course
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can create/update syllabus' });
    }
    const syllabus = await Syllabus.create({
      ...req.body,
      teacherId: req.user.id,
      updatedAt: new Date(),
    });
    res.status(201).json(syllabus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id â€” TEACHER only
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can update syllabus' });
    }
    const syllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!syllabus) return res.status(404).json({ message: 'Syllabus not found' });
    res.json(syllabus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


