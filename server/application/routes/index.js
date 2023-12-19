const loginRouter = require('./login_routes.js');
const doctorRouter = require('./doctorRoutes.js');
const patientRouter = require('./patientRoutes.js');
const appointmentRouter = require('./appointment_routes.js');
const reviewRouter = require('./review_routes.js');

module.exports = function (application) {
    application.use('/login', loginRouter);
    application.use('/doctor', doctorRouter);
    application.use('/patient', patientRouter);
    application.use('/appts', appointmentRouter);
    application.use('/review',reviewRouter);
};
