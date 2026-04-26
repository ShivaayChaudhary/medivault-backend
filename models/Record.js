const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  familyMemberId: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMember', default: null },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['prescription', 'lab_report', 'xray', 'discharge_summary', 'vaccination', 'other'],
    required: true
  },
  fileUrl: { type: String, required: true },
  filePublicId: { type: String },
  notes: { type: String, default: '' },
  doctorName: { type: String, default: '' },
  hospitalName: { type: String, default: '' },
  recordDate: { type: Date, default: Date.now },
  medicineName: { type: String, default: '' },
  expiryDate:   { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', RecordSchema);
