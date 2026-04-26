const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FamilyMember = require('../models/FamilyMember');

// Add family member
router.post('/', auth, async (req, res) => {
  try {
    const { name, relation, dateOfBirth, bloodGroup, allergies, currentMedications } = req.body;
    const member = new FamilyMember({
      userId: req.userId,
      name, relation, dateOfBirth, bloodGroup,
      allergies: allergies || [],
      currentMedications: currentMedications || []
    });
    await member.save();
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all family members
router.get('/', auth, async (req, res) => {
  try {
    const members = await FamilyMember.find({ userId: req.userId });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update family member
router.put('/:id', auth, async (req, res) => {
  try {
    const member = await FamilyMember.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete family member
router.delete('/:id', auth, async (req, res) => {
  try {
    await FamilyMember.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
