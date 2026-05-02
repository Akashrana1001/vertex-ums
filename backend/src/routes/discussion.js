const express = require('express');
const Discussion = require('../models/Discussion');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” all discussions, optional ?courseId filter
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;
    const discussions = await Discussion.find(filter)
      .populate('courseId', 'title')
      .populate('authorId', 'name email role')
      .populate('replies.authorId', 'name email role')
      .sort({ createdAt: -1 });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” authenticated, create discussion post
router.post('/', async (req, res) => {
  try {
    const discussion = await Discussion.create({ ...req.body, authorId: req.user.id });
    res.status(201).json(discussion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /:id/reply â€” authenticated, add reply
router.post('/:id/reply', async (req, res) => {
  try {
    const { content } = req.body;
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

    discussion.replies.push({ authorId: req.user.id, content });
    await discussion.save();
    await discussion.populate('replies.authorId', 'name email role');
    res.json(discussion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /:id â€” author or teacher can delete
router.delete('/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

    const isOwner = discussion.authorId.toString() === req.user.id;
    const isTeacher = req.user.role === 'TEACHER';

    if (!isOwner && !isTeacher) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await discussion.deleteOne();
    res.json({ message: 'Discussion deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


