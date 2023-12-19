const AppointmentService = require('../services/appointment_service');

const createAppointment = async (req, res) => {
    try {
        req.body.username = req.session.username;
        const appointment = await AppointmentService.createAppointment(req.body);
        res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `${error}` });
    }
};

const getAppointments = async (request, response) => {
    try {
        const appointments = await AppointmentService.getAppointments(request.session.username);
        response.status(201).json(appointments);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error creating appointment' });
    }
}

const getDoctorAppointments = async (request, response) => {
    try {
        const appointments = await AppointmentService.getDoctorAppointments(request.params.id);
        response.status(201).json(appointments);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error creating appointment' });
    }
}

const patchAppointment = async (request, response) => {
    try {
        const appointments = await AppointmentService.patchAppointment(request.body);
        response.status(201).json(appointments);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error patching appointment' });
    }
}

const deleteAppointment = async (request, response) => {
    try {
        const appointment = await AppointmentService.deleteAppointment(request.body._id);
        response.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error patching appointment' });
    }
}


module.exports = {
    createAppointment,
    getAppointments,
    patchAppointment,
    getDoctorAppointments,
    deleteAppointment
};
