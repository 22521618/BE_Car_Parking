const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  apartmentNumber: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resident', residentSchema);
