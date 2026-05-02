const express = require('express');
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / — get attendance record(s) for a course, optionally filtered by date
router.get('/', async (req, res) => {
  try {
    const { courseId, date } = req.query;
    if (!courseId) return res.status(400).json({ message: 'courseId required' });

    const filter = { courseId };
    if (date) {
      const d = new Date(date);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const records = await Attendance.find(filter)
      .populate('presentStudents', 'name email')
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / — TEACHER only, save manual attendance for a course on a date
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') return res.status(403).json({ message: 'Teachers only' });

    const { courseId, date, presentStudents = [] } = req.body;
    if (!courseId || !date) return res.status(400).json({ message: 'courseId and date required' });

    const d = new Date(date);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

    const record = await Attendance.findOneAndUpdate(
      { courseId, date: { $gte: start, $lt: end } },
      { courseId, teacherId: req.user.id, date: start, presentStudents, isOpen: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate('presentStudents', 'name email');

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /month — get all attendance records for a course in a given month
router.get('/month', async (req, res) => {
  try {
    const { courseId, year, month } = req.query;
    if (!courseId || !year || !month) return res.status(400).json({ message: 'courseId, year, month required' });

    const start = new Date(parseInt(year), parseInt(month) - 1, 1);
    const end = new Date(parseInt(year), parseInt(month), 1);

    const records = await Attendance.find({ courseId, date: { $gte: start, $lt: end } })
      .populate('presentStudents', 'name email')
      .sort({ date: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
