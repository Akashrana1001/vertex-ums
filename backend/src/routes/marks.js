const express = require('express');
const Mark = require('../models/Mark');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” TEACHER: all marks, STUDENT: own marks
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'STUDENT') {
      filter.studentId = req.user.id;
    } else if (req.user.role === 'TEACHER') {
      filter.teacherId = req.user.id;
      if (req.query.userId) filter.studentId = req.query.userId;
    } else if (req.query.userId) {
      filter.studentId = req.query.userId;
    }
    if (req.query.courseId) filter.courseId = req.query.courseId;
    const marks = await Mark.find(filter)
      .populate('studentId', 'name email')
      .populate('courseId', 'title')
      .populate('examId', 'title date type')
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” TEACHER only, create or upsert mark
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can enter marks' });
    }
    const { studentId, courseId, examId } = req.body;
    const filter = { studentId, courseId };
    if (examId) filter.examId = examId;

    const upserted = await Mark.findOneAndUpdate(
      filter,
      { ...req.body, teacherId: req.user.id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    const mark = await Mark.findById(upserted._id)
      .populate('studentId', 'name email')
      .populate('courseId', 'title')
      .populate('examId', 'title date type')
      .populate('teacherId', 'name email');

    const io = req.app.get('io');
    if (io) io.emit('updateMark', mark);

    res.status(201).json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id â€” TEACHER only, update mark
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can update marks' });
    }
    const updated = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Mark not found' });
    const mark = await Mark.findById(updated._id)
      .populate('studentId', 'name email')
      .populate('courseId', 'title')
      .populate('examId', 'title date type')
      .populate('teacherId', 'name email');

    const io = req.app.get('io');
    if (io) io.emit('updateMark', mark);

    res.json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


