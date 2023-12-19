const Doctor = require('../models/doctor.js');
const Review = require('../models/review.js');
const Appointment = require('../models/appointment.js');
const User = require('../models/login_model');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const totalSlotsPerDay = 8;

const cloudinary = require('cloudinary').v2;


const storeImage = async (file) => {
  if (!file) throw new Error('No file uploaded');

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, { folder: "uploads" }, (error, result) => {
      if (error) reject(error);
      else resolve(result.url);
    });
  });
};

function convertToLocalTime(date, offset) {
  return new Date(date.getTime() - offset * 60 * 60 * 1000);
}

async function getBookedSlotsCount(id) {
  const utcOffsetForEST = 5; // EST is UTC-5

  // Set startDate to the current date in EST
  let startDate = convertToLocalTime(new Date(), 5);
  startDate.setHours(0, 0, 0, 0);

  // Set endDate to 28 days later
  let endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 28);
  endDate.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    doctorId: id,
    startTime: { $gte: startDate, $lte: endDate }
  });

  let bookedCountPerDay = {};
  appointments.forEach(appointment => {
    const dayStr = appointment.date.toISOString().split('T')[0];
    bookedCountPerDay[dayStr] = (bookedCountPerDay[dayStr] || 0) + 1;
  });

  return bookedCountPerDay;
}


async function getDoctorDetailsWithReviews(doctorId) {
  try {
    const doctor = await Doctor.findOne({ id: doctorId });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    const reviews = await Review.find({ doctorId });

    const doctorWithReviews = {
      ...doctor.toObject(),
      reviews,
    };

    return doctorWithReviews;
  } catch (error) {
    throw new Error(`Error getting doctor details: ${error.message}`);
  }
}

async function allDoctors() {
  const doctors = await Doctor.find({});
  return doctors;
}

async function searchDoctors(criteria) {
  try {
    let query = {};

    // Adding filters to the query if they are provided in the criteria
    if (criteria.specialty) {
      query.specialty = { $regex: criteria.specialty, $options: 'i' };
    }
    if (criteria.location) {
      query.address = { $regex: criteria.location, $options: 'i' };
    }
    if (criteria.name) {
      // Assuming name is a full or partial match and using a regular expression for flexibility
      query.name = { $regex: criteria.name, $options: 'i' }; // 'i' for case-insensitive
    }

    const doctors = await Doctor.find(query);

    const doctorsWithAvailability = await Promise.all(doctors.map(async (doctor) => {
      const bookedCount = await getBookedSlotsCount(doctor.id);
      let availabilitySummary = {};


      // Calculate available slots for the next 28 days
      for (let i = 0; i < 28; i++) {
        let day = convertToLocalTime(new Date(), 0);
        day.setDate(day.getDate() + i);
        const dayStr = day.toLocaleDateString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        let totalSlotsPerDay = 8;
        availabilitySummary[dayStr] = totalSlotsPerDay - (bookedCount[dayStr] || 0);
      }

      return {
        ...doctor.toObject(),
        availabilitySummary
      };
    }));

    return doctorsWithAvailability;
  } catch (error) {
    throw new Error(`Error searching doctors: ${error.message}`);
  }
}

async function createDoctor(doctorData) {
  try {
    const newDoctor = new Doctor(doctorData);
    const doctor = await newDoctor.save();
    const { username, password } = doctorData;
    const user = new User({
      username: username,
      password: password,
      type: 'doctor',
    });
    await user.save();
    return doctor;
  } catch (error) {
    throw new Error(`Error creating doctor: ${error.message}`);
  }
}

function formatTime(date) {
  return date.getUTCHours().toString().padStart(2, '0') + ':' + date.getUTCMinutes().toString().padStart(2, '0');
}

// async function getSlotDetailsForDay(id, dateString) {
//   const workingHoursStart = 9; // 9:00 AM UTC
//   const workingHoursEnd = 17; // 5:00 PM UTC

//   let startOfDay = new Date(dateString);
//   startOfDay.setUTCHours(workingHoursStart, 0, 0, 0);

//   let endOfDay = new Date(dateString);
//   endOfDay.setUTCHours(workingHoursEnd, 0, 0, 0);

//   const appointments = await Appointment.find({
//     doctorId: id,
//     startTime: { $gte: startOfDay },
//     endTime: { $lte: endOfDay }
//   });

//   let slots = [];
//   for (let hour = workingHoursStart; hour < workingHoursEnd; hour++) {
//     let slotStart = new Date(dateString);
//     slotStart.setUTCHours(hour, 0, 0, 0);

//     let slotEnd = new Date(dateString);
//     slotEnd.setUTCHours(hour + 1, 0, 0, 0);

//     slots.push({ start: slotStart, end: slotEnd });
//   }

//   let availableSlots = slots.filter(slot =>
//     !appointments.some(appointment =>
//       appointment.startTime.getTime() === slot.start.getTime() &&
//       appointment.endTime.getTime() === slot.end.getTime()
//     )
//   ).map(slot => ({ start: formatTime(slot.start), end: formatTime(slot.end) }));

//   return availableSlots;
// }

async function getSlotDetailsForDay(id, dateString) {
  const estToUtcOffset = 5; // EST is UTC-5
  const workingHoursStart = 9; // 9:00 AM EST
  const workingHoursEnd = 17; // 5:00 PM EST

  // Convert EST working hours to UTC
  let startOfDayUtc = new Date(dateString);
  startOfDayUtc.setUTCHours(workingHoursStart + estToUtcOffset, 0, 0, 0);

  let endOfDayUtc = new Date(dateString);
  endOfDayUtc.setUTCHours(workingHoursEnd + estToUtcOffset, 0, 0, 0);

  // Fetch appointments within the UTC time range
  const appointments = await Appointment.find({
    doctorId: id,
    startTime: { $gte: startOfDayUtc },
    endTime: { $lte: endOfDayUtc }
  });

  let slots = [];
  for (let hour = workingHoursStart; hour < workingHoursEnd; hour++) {
    let slotStartUtc = new Date(dateString);
    slotStartUtc.setUTCHours(hour + estToUtcOffset, 0, 0, 0);

    let slotEndUtc = new Date(dateString);
    slotEndUtc.setUTCHours(hour + 1 + estToUtcOffset, 0, 0, 0);

    slots.push({ start: slotStartUtc, end: slotEndUtc });
  }

  let availableSlots = slots.filter(slot =>
    !appointments.some(appointment =>
      appointment.startTime <= slot.start &&
      appointment.endTime >= slot.end
    )
  ).map(slot => ({
    start: slot.start.toISOString(),
    end: slot.end.toISOString()
  }));

  return availableSlots;
}

async function getDoctorProfile(username) {

  try {
    const doctor = await Doctor.findOne({ username });
    return doctor;
  }
  catch (err) {
    throw new Error(err.message);
  }

}

async function getDoctorById(doctorId) {
  try {
    // Find the doctor by ID
    const doctor = await Doctor.findOne({ id: doctorId });

    // Handle case where doctor is not found
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    const bookedCount = await getBookedSlotsCount(doctor.id);
    let availabilitySummary = {};

    // Calculate available slots for the next 28 days
    for (let i = 0; i < 28; i++) {
      let day = convertToLocalTime(new Date(), 0);
      day.setDate(day.getDate() + i);
      const dayStr = day.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      let totalSlotsPerDay = 8; // Assuming a fixed number of slots per day
      availabilitySummary[dayStr] = totalSlotsPerDay - (bookedCount[dayStr] || 0);
    }

    return {
      ...doctor.toObject(),
      availabilitySummary
    };
  } catch (error) {
    throw new Error(`Error retrieving doctor by ID: ${error.message}`);
  }
}


module.exports = {
  getDoctorDetailsWithReviews,
  searchDoctors,
  createDoctor,
  allDoctors,
  getSlotDetailsForDay,
  getDoctorProfile,
  getDoctorById,
  storeImage
};
