const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  familyMemberId:  { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMember', default: null },
  doctorName:      { type: String, required: true },
  speciality:      { type: String, default: '' },
  hospitalName:    { type: String, default: '' },
  visitDate:       { type: Date, required: true },
  diagnosis:       { type: String, default: '' },
  notes:           { type: String, default: '' },
  nextAppointment: { type: Date, default: null },
  createdAt:       { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visit', VisitSchema);
