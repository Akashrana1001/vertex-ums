const express = require('express');
const Announcement = require('../models/Announcement');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('teacherId', 'name')
      .populate('courseId', 'title')
      .sort({ timestamp: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
