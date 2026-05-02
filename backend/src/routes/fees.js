const express = require('express');
const Fee = require('../models/Fee');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” TEACHER: all fees, STUDENT: own fees
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'STUDENT') {
      filter.studentId = req.user.id;
    } else if (req.query.studentId) {
      filter.studentId = req.query.studentId;
    }
    const fees = await Fee.find(filter)
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” TEACHER only, create fee record for a student
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can create fee records' });
    }
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id â€” update fee status
router.put('/:id', async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    // Students can only mark as paid; teachers can set any status
    if (req.user.role === 'STUDENT') {
      if (fee.studentId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      fee.status = 'paid';
      fee.paidDate = new Date();
    } else {
      Object.assign(fee, req.body);
      if (req.body.status === 'paid' && !fee.paidDate) {
        fee.paidDate = new Date();
      }
    }

    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


