const express = require('express');
const Assignment = require('../models/Assignment');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” all assignments, optional ?courseId filter
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.user.role === 'TEACHER') filter.teacherId = req.user.id;
    const assignments = await Assignment.find(filter)
      .populate('courseId', 'title')
      .populate('teacherId', 'name email')
      .populate('submissions.studentId', 'name email')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” TEACHER only, create assignment
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can create assignments' });
    }
    const created = await Assignment.create({
      ...req.body,
      teacherId: req.user.id,
    });
    const assignment = await Assignment.findById(created._id)
      .populate('courseId', 'title')
      .populate('teacherId', 'name email')
      .populate('submissions.studentId', 'name email');

    const io = req.app.get('io');
    if (io) io.emit('newAssignment', assignment);

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /:id â€” TEACHER only
router.delete('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can delete assignments' });
    }
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const io = req.app.get('io');
    if (io) io.emit('deleteAssignment', { _id: req.params.id });

    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /:id/submit â€” STUDENT only, add submission
router.post('/:id/submit', async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can submit assignments' });
    }
    const { fileUrl } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Remove previous submission by this student if any
    assignment.submissions = assignment.submissions.filter(
      (s) => s.studentId.toString() !== req.user.id
    );
    assignment.submissions.push({ studentId: req.user.id, fileUrl });
    await assignment.save();
    const populated = await Assignment.findById(assignment._id)
      .populate('courseId', 'title')
      .populate('teacherId', 'name email')
      .populate('submissions.studentId', 'name email');

    const io = req.app.get('io');
    if (io) io.emit('updateAssignment', populated);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id/grade â€” TEACHER only, grade a submission
router.put('/:id/grade', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can grade submissions' });
    }
    const { studentId, grade, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const submission = assignment.submissions.find(
      (s) => s.studentId.toString() === studentId
    );
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.grade = grade;
    submission.feedback = feedback;
    await assignment.save();
    const populated = await Assignment.findById(assignment._id)
      .populate('courseId', 'title')
      .populate('teacherId', 'name email')
      .populate('submissions.studentId', 'name email');

    const io = req.app.get('io');
    if (io) io.emit('updateAssignment', populated);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


