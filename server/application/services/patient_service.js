// services/patientService.js
const Patient = require('../models/patient');
const User    = require('../models/login_model');

exports.createPatient = async (patientData) => {
  try {
    const newPatient = new Patient(patientData);
    const patient = await newPatient.save();

    const { username, password } = patientData;
    const user = new User({
      username: username,
      password: password,
      type: 'patient',
    });
    await user.save();

    return patient;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getPatient = async (username) => {

  try {
    const patient = await Patient.findOne({username});
    return patient;
  }
  catch (err) {
    throw new Error(err.message);
  }

}

exports.updatePatient = async (username,data) => {

  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { username },
      { $set: data },
      { new: true }
    );

    if (!updatedPatient) {
      throw new Error('Patient not found');
    }

    return updatedPatient;
  }
  catch (err) {
    throw new Error(err.message);
  }

}

