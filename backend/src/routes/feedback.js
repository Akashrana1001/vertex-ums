const express = require('express');
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” TEACHER: all feedback, STUDENT: own feedback
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'STUDENT') filter.studentId = req.user.id;
    if (req.query.courseId) filter.courseId = req.query.courseId;
    const feedbacks = await Feedback.find(filter)
      .populate('courseId', 'title')
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” STUDENT only, submit feedback
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can submit feedback' });
    }
    const feedback = await Feedback.create({ ...req.body, studentId: req.user.id });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


