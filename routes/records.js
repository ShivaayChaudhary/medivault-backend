const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, cloudinary } = require('../middleware/cloudinary');
const Record = require('../models/Record');

// Upload a record
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, type, notes, doctorName, hospitalName, recordDate,
            familyMemberId, medicineName, expiryDate } = req.body;

    const record = new Record({
      userId: req.userId,
      familyMemberId: familyMemberId || null,
      title, type, notes, doctorName, hospitalName,
      recordDate: recordDate || Date.now(),
      fileUrl: req.file.path,
      filePublicId: req.file.filename,
      medicineName: medicineName || '',
      expiryDate: expiryDate || null
    });

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// Get expiring medicines — MUST be before /:id
router.get('/expiring', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 60;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);

    const medicines = await Record.find({
      userId: req.userId,
      type: 'prescription',
      expiryDate: { $ne: null, $lte: cutoff }
    }).sort({ expiryDate: 1 });

    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all records for user
router.get('/', auth, async (req, res) => {
  try {
    const { type, familyMemberId } = req.query;
    const filter = { userId: req.userId };
    if (type) filter.type = type;
    if (familyMemberId) filter.familyMemberId = familyMemberId;
    else if (familyMemberId === 'self') filter.familyMemberId = null;

    const records = await Record.find(filter).sort({ recordDate: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single record
router.get('/:id', auth, async (req, res) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, userId: req.userId });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a record
router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, userId: req.userId });
    if (!record) return res.status(404).json({ message: 'Record not found' });

    if (record.filePublicId) {
      await cloudinary.uploader.destroy(record.filePublicId, { resource_type: 'raw' });
    }

    await record.deleteOne();
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
