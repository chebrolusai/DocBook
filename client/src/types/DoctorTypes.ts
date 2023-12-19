export interface BookedSlot {
    start: string;
    end: string;
}

export interface DateAvailability {
    date: Date;
    slots: BookedSlot[];
}

export interface Doctor {
    id: number;
    username: string;
    name: string;
    specialty: string;
    address: string;
    location: {
        latitude: number;
        longitude: number;
    };
    email: string;
    rating: number;
    profilePicture: string;
    availabilitySummary: { [date: string]: number };
    insuranceProviders: string[];
    education: [
        {
            degree: string;
            university: string;
        }
    ];
    experience: [
        {
            position: string;
            hospital: string;
            duration: string;
        }
    ];
    about: string;
}

export interface SearchCriteria {
    name: string;
    specialty: string;
    location: string;
}

export interface Slot {
    start: string;
    end: string;
}

export interface AppointmentData {
    doctorId: number;
    name: string;
    email: string;
    condition: string;
    startTime: Date;  // e.g., "09:00"
    endTime: Date;    // e.g., "10:00"
    date: Date;
    insuranceProvider?: string;
    insuranceNumber?: string;
}
