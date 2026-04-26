const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const Visit   = require('../models/Visit');

// POST /api/visits — log a new visit
router.post('/', auth, async (req, res) => {
  try {
    const { doctorName, speciality, hospitalName, visitDate,
            diagnosis, notes, nextAppointment, familyMemberId } = req.body;
    const visit = new Visit({
      userId: req.userId,
      familyMemberId: familyMemberId || null,
      doctorName, speciality, hospitalName,
      visitDate, diagnosis, notes,
      nextAppointment: nextAppointment || null
    });
    await visit.save();
    res.json(visit);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/visits — all visits, newest first
router.get('/', auth, async (req, res) => {
  try {
    const visits = await Visit.find({ userId: req.userId }).sort({ visitDate: -1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/visits/upcoming — next appointments within 60 days
// IMPORTANT: this route must be defined BEFORE /:id
router.get('/upcoming', auth, async (req, res) => {
  try {
    const now    = new Date();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 60);
    const visits = await Visit.find({
      userId: req.userId,
      nextAppointment: { $gte: now, $lte: cutoff }
    }).sort({ nextAppointment: 1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/visits/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Visit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
