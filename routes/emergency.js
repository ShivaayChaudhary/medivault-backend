const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Public route - no auth - doctor scans QR and sees this
router.get('/:qrId', async (req, res) => {
  try {
    const user = await User.findOne({ emergencyQRId: req.params.qrId }).select(
      'name bloodGroup allergies currentMedications emergencyContact'
    );
    if (!user) return res.status(404).json({ message: 'Emergency profile not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
