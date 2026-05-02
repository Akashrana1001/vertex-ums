const express = require('express');
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” TEACHER: all requests, STUDENT: own requests
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'STUDENT') filter.studentId = req.user.id;
    const certificates = await Certificate.find(filter)
      .populate('studentId', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ requestedAt: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” STUDENT only, submit request
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can request certificates' });
    }
    const certificate = await Certificate.create({ ...req.body, studentId: req.user.id });
    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id â€” TEACHER only, approve/reject
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can process certificate requests' });
    }
    const { status, remarks } = req.body;
    const update = { status, remarks };
    if (status === 'approved') {
      update.approvedAt = new Date();
      update.approvedBy = req.user.id;
    }
    const certificate = await Certificate.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!certificate) return res.status(404).json({ message: 'Certificate request not found' });
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


