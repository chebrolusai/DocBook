import {
    AppointmentData,
    Doctor,
    SearchCriteria,
    Slot,
} from "./types/DoctorTypes";

export const searchDoctors = (
    searchCriteria: SearchCriteria
): Promise<Doctor[]> => {
    return new Promise((resolve, reject) => {
        fetch("/doctor/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(searchCriteria),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => resolve(data as Doctor[]))
            .catch((error) => reject(error));
    });
};

export const fetchSlotDetails = (
    doctorId: string,
    date: Date
): Promise<Slot[]> => {
    return new Promise((resolve, reject) => {
        const formattedDate = date.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        fetch(
            `/doctor/slot/${doctorId}/slots?date=${formattedDate}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => resolve(data as Slot[]))
            .catch((error) => reject(error));
    });
};

export const fetchDoctorDetails = async (doctorId: Number) => {
    try {
        const response = await fetch(`/doctor/${doctorId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching doctor details:", error);
    }
};

export const createAppointment = async (appointmentData: AppointmentData) => {
    try {
        const response = await fetch("/appts/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(appointmentData),
        });

        if (!response.ok) {
            const errorResponse = await response.json(); // Parse the JSON response body
            const errorMessage = errorResponse.message || `Error: ${response.status}`;
            console.log(errorMessage);
            throw new Error(errorMessage.split(': ')[1]);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create appointment:", error);
        throw error; // This error now includes the server's error message if available
    }
};

