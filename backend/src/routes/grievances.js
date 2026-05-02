const express = require('express');
const Grievance = require('../models/Grievance');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” TEACHER: all grievances, STUDENT: own
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'STUDENT') filter.studentId = req.user.id;
    const grievances = await Grievance.find(filter)
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” STUDENT only, submit grievance
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can submit grievances' });
    }
    const grievance = await Grievance.create({ ...req.body, studentId: req.user.id });
    res.status(201).json(grievance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id â€” TEACHER only, update status
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can update grievance status' });
    }
    const update = { ...req.body };
    if (req.body.status === 'resolved' || req.body.status === 'closed') {
      update.resolvedAt = new Date();
    }
    const grievance = await Grievance.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });
    res.json(grievance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


