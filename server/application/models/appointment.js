const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorId: Number,
    username: String,
    name: String,
    email: String,
    condition: String,
    startTime: Date,
    endTime: Date,
    date: Date,
    insuranceProvider: String,
    insuranceNumber: String,
    reviewed : {
        type: Boolean,
        default: false,
    }
});

const combineDateAndTime = (date, time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0); // Sets hours and minutes, seconds and milliseconds to 0
    return combined;
};


appointmentSchema.pre('save', function (next) {
    if (this.date && this.startTime && typeof this.startTime === 'string') {
        this.startTime = combineDateAndTime(this.date, this.startTime);
    }
    if (this.date && this.endTime && typeof this.endTime === 'string') {
        this.endTime = combineDateAndTime(this.date, this.endTime);
    }
    next();
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
