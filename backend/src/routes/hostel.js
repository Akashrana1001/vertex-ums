const express = require('express');
const HostelRoom = require('../models/HostelRoom');
const HostelApplication = require('../models/HostelApplication');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// GET /rooms â€” all rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await HostelRoom.find().populate('occupants', 'name email');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /rooms â€” TEACHER only, add room
router.post('/rooms', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can add hostel rooms' });
    }
    const room = await HostelRoom.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /applications â€” TEACHER: all, STUDENT: own
router.get('/applications', async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'STUDENT') filter.studentId = req.user.id;
    const applications = await HostelApplication.find(filter)
      .populate('studentId', 'name email')
      .populate('roomId', 'roomNumber floor type')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /applications â€” STUDENT only, apply
router.post('/applications', async (req, res) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can apply for hostel' });
    }
    const application = await HostelApplication.create({
      ...req.body,
      studentId: req.user.id,
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /applications/:id â€” TEACHER only, approve/reject
router.put('/applications/:id', async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ message: 'Only teachers can process hostel applications' });
    }
    const { status, roomId, remarks } = req.body;
    const update = { status, remarks, processedAt: new Date() };
    if (roomId) update.roomId = roomId;

    const application = await HostelApplication.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // If approved and roomId provided, add student to room occupants
    if (status === 'approved' && roomId) {
      const room = await HostelRoom.findById(roomId);
      if (room) {
        if (!room.occupants.includes(application.studentId)) {
          room.occupants.push(application.studentId);
          if (room.occupants.length >= room.capacity) room.status = 'full';
          await room.save();
        }
      }
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


