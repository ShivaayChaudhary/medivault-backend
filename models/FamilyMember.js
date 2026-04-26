const mongoose = require('mongoose');

const FamilyMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  relation: {
    type: String,
    enum: ['father', 'mother', 'spouse', 'son', 'daughter', 'grandfather', 'grandmother', 'other'],
    required: true
  },
  dateOfBirth: { type: Date },
  bloodGroup: { type: String, default: '' },
  allergies: [{ type: String }],
  currentMedications: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FamilyMember', FamilyMemberSchema);
