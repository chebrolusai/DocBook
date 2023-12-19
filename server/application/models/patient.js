const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  Username: String,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  Address: String,
  dob: {
    type: Date,
    required: true,
  },
  insurance: String,
  height: Number,
  weight: Number,
});

module.exports = mongoose.model('Patient', patientSchema);
