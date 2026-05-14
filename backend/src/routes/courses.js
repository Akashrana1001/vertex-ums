const express = require('express');
const Course = require('../models/Course');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const filter = {};
    // Teachers only see their own courses; students see all (for enrollment)
    if (req.user.role === 'TEACHER' && !req.query.all) {
      filter.teacherId = req.user.id;
    }
    const courses = await Course.find(filter).populate('teacherId', 'name email').populate('enrolledStudents', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') return res.status(403).json({ message: 'Forbidden' });
    const { title } = req.body;
    const course = await Course.create({ title, teacherId: req.user.id });
    const populated = await course.populate('teacherId', 'name email');

    const io = req.app.get('io');
    if (io) io.emit('newCourse', populated);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/students', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') return res.status(403).json({ message: 'Forbidden' });
    const course = await Course.findById(req.params.id).populate('enrolledStudents', 'name email isOnline');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course.enrolledStudents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/enroll', async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') return res.status(403).json({ message: 'Forbidden' });
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }
    course.enrolledStudents.push(req.user.id);
    await course.save();

    const io = req.app.get('io');
    if (io) {
      const populated = await Course.findById(course._id)
        .populate('teacherId', 'name email')
        .populate('enrolledStudents', 'name email');
      io.emit('updateCourse', populated);
    }

    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
