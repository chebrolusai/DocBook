const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointment_controller');

router.post('/create', AppointmentController.createAppointment);
router.get('/',AppointmentController.getAppointments);
router.delete('/',AppointmentController.deleteAppointment);
router.get('/:id',AppointmentController.getDoctorAppointments);
router.patch('/',AppointmentController.patchAppointment);

module.exports = router;
