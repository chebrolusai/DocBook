const mongoose = require('mongoose');

const bookedSlotSchema = new mongoose.Schema({
  start: String,
  end: String
});

const dateAvailabilitySchema = new mongoose.Schema({
  date: Date,
  slots: [bookedSlotSchema]
});

const doctorSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
  availability: [dateAvailabilitySchema],
  insuranceProviders: [String],
  education: [
    {
      degree: {
        type: String,
        required: true,
      },
      university: {
        type: String,
        required: true,
      },
    },
  ],
  experience: [
    {
      position: {
        type: String,
        required: true,
      },
      hospital: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
    },
  ],
  about: {
    type: String,
    required: true,
  },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;

