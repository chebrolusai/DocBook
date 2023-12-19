interface Appointment {
    _id: number;
    doctorId: number;
    doctorName: String;
    doctorSpecialty: String;
    username: string;
    name: string;
    email: string;
    condition: string;
    startTime: Date;
    endTime: Date;
    date: Date;
    insuranceProvider: string;
    insuranceNumber: string;
    reviewed: Boolean;
}

export default Appointment;