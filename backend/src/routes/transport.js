const express = require('express');
const Transport = require('../models/Transport');
const TransportRegistration = require('../models/TransportRegistration');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET /routes â€” all transport routes
router.get('/routes', async (req, res) => {
  try {
    const routes = await Transport.find().sort({ routeNumber: 1 });
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /routes â€” TEACHER only, add route
router.post('/routes', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can add transport routes' });
    }
    const route = await Transport.create(req.body);
    res.status(201).json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /registrations â€” TEACHER: all, STUDENT: own
router.get('/registrations', async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'STUDENT') filter.studentId = req.user.id;
    const registrations = await TransportRegistration.find(filter)
      .populate('studentId', 'name email')
      .populate('transportId', 'routeNumber routeName stops')
      .sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /registrations â€” STUDENT only, register
router.post('/registrations', async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can register for transport' });
    }
    const registration = await TransportRegistration.create({
      ...req.body,
      studentId: req.user.id,
    });
    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /registrations/:id â€” TEACHER only, approve/reject
router.put('/registrations/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can process transport registrations' });
    }
    const registration = await TransportRegistration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    res.json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


