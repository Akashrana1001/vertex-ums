const express = require('express');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” own notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” TEACHER only, send notification to specific user or broadcast to all
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can send notifications' });
    }
    const { userId, title, message, type } = req.body;

    if (userId) {
      // Send to specific user
      const notification = await Notification.create({ userId, title, message, type });
      return res.status(201).json(notification);
    }

    // Broadcast to all students
    const students = await User.find({ role: 'student' }, '_id');
    const docs = students.map((s) => ({ userId: s._id, title, message, type }));
    const notifications = await Notification.insertMany(docs);
    res.status(201).json({ count: notifications.length, message: 'Broadcast sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /read-all â€” mark all notifications as read for current user
// NOTE: must be declared before /:id/read to avoid route conflict
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id/read â€” mark single notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


