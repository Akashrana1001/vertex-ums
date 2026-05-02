const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET /profile â€” own profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /profile â€” update own profile
router.put('/profile', async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'address', 'bio', 'avatar'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /teachers â€” all teachers (visible to students and teachers)
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'TEACHER' }).select('-password').sort({ name: 1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /students â€” TEACHER only, all students
router.get('/students', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can view all students' });
    }
    const students = await User.find({ role: 'STUDENT' }).select('-password').sort({ name: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


