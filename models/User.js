const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: { type: String, default: '' },
  allergies: [{ type: String }],
  currentMedications: [{ type: String }],
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  emergencyQRId: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
