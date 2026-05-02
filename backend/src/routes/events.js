const express = require('express');
const UmsEvent = require('../models/UmsEvent');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET / â€” all events
router.get('/', async (req, res) => {
  try {
    const events = await UmsEvent.find()
      .populate('organizer', 'name email')
      .populate('registrations', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / â€” TEACHER only, create event
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can create events' });
    }
    const event = await UmsEvent.create({ ...req.body, organizer: req.user.id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id â€” TEACHER only, update
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can update events' });
    }
    const event = await UmsEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /:id/register â€” STUDENT only, register for event
router.post('/:id/register', async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can register for events' });
    }
    const event = await UmsEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.registrations.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    if (event.capacity && event.registrations.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    event.registrations.push(req.user.id);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


