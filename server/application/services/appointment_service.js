const Appointment = require('../models/appointment');

const createAppointment = async (appointmentData) => {
    // Extract relevant data from appointmentData
    const { doctorId, startTime, endTime } = appointmentData;

    // Check for any existing appointment that overlaps with the new time slot for the same doctor
    const existingAppointment = await Appointment.findOne({
        doctorId: doctorId,
        $or: [
            // Check if any appointment starts before and ends after the start of the new appointment
            { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } },
            // Check if any appointment starts during the new appointment
            { startTime: { $gte: new Date(startTime), $lt: new Date(endTime) } }
        ]
    });

    // If an overlapping appointment exists, throw an error or return a message
    if (existingAppointment) {
        throw new Error('An appointment already exists in the selected time slot.');
        // Or return a specific response to indicate the slot is not available
    }

    // If no overlapping appointment, save the new appointment
    const appointment = new Appointment(appointmentData);
    return await appointment.save();
};



const getAppointments = async (username) => {

    try {
        const appointments = await Appointment.find({ username: username });
        return appointments;
    }
    catch (err) {
        throw err;
    }

}

const getDoctorAppointments = async (id) => {

    try {
        const appointments = await Appointment.find({ doctorId: id });
        return appointments;
    }
    catch (err) {
        throw err;
    }

}

const patchAppointment = async (appointmentData) => {
    const { _id, ...updateData } = appointmentData;

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            _id,
            { $set: updateData },
            { new: true }
        );

        return updatedAppointment;
    } catch (err) {
        throw err;
    }
}

const deleteAppointment = async (appointmentId) => {

    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

        return deletedAppointment;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createAppointment,
    getAppointments,
    patchAppointment,
    getDoctorAppointments,
    deleteAppointment
};
