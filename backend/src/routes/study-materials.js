const express = require('express');
const StudyMaterial = require('../models/StudyMaterial');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” all study materials, optional ?courseId filter
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.user.role === 'TEACHER') filter.teacherId = req.user.id;
    const materials = await StudyMaterial.find(filter)
      .populate('courseId', 'title')
      .populate('teacherId', 'name email')
      .sort({ uploadedAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” TEACHER only, upload material
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can upload study materials' });
    }
    const created = await StudyMaterial.create({ ...req.body, teacherId: req.user.id });
    const material = await StudyMaterial.findById(created._id)
      .populate('courseId', 'title')
      .populate('teacherId', 'name email');

    const io = req.app.get('io');
    if (io) io.emit('newStudyMaterial', material);

    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /:id â€” TEACHER only
router.delete('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can delete study materials' });
    }
    const material = await StudyMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ message: 'Study material not found' });

    const io = req.app.get('io');
    if (io) io.emit('deleteStudyMaterial', { _id: req.params.id });

    res.json({ message: 'Study material deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


