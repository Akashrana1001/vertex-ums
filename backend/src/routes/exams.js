const express = require('express');
const Exam = require('../models/Exam');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” all exams, optional ?courseId filter
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.user.role === 'TEACHER') filter.teacherId = req.user.id;
    const exams = await Exam.find(filter)
      .populate('courseId', 'title')
      .populate('teacherId', 'name email')
      .sort({ date: 1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” TEACHER only, create exam
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can create exams' });
    }
    const created = await Exam.create({ ...req.body, teacherId: req.user.id });
    const exam = await Exam.findById(created._id)
      .populate('courseId', 'title')
      .populate('teacherId', 'name email');

    const io = req.app.get('io');
    if (io) io.emit('newExam', exam);

    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id â€” TEACHER only, update exam
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can update exams' });
    }
    const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Exam not found' });
    const exam = await Exam.findById(updated._id)
      .populate('courseId', 'title')
      .populate('teacherId', 'name email');

    const io = req.app.get('io');
    if (io) io.emit('updateExam', exam);

    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /:id â€” TEACHER only
router.delete('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can delete exams' });
    }
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const io = req.app.get('io');
    if (io) io.emit('deleteExam', { _id: req.params.id });

    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


