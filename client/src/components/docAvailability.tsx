import React, { useEffect, useState } from 'react';
import AvailabilityGrid from '../components/availabilityGrid';
import { Doctor } from '../types/DoctorTypes';

const DocAvailability: React.FC<{ doctorId: number }> = ({ doctorId }) => {
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/doctor/get-availability/${doctorId}`); // Adjust API endpoint as needed
                if (!response.ok) {
                    throw new Error('Doctor data fetching failed');
                }
                const data = await response.json();
                setDoctor(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctor();
    }, [doctorId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!doctor) {
        return <div>Doctor not found</div>;
    }

    return (
        <div>
            <h2>{doctor.name}'s Availability</h2>
            <AvailabilityGrid availabilitySummary={doctor.availabilitySummary} doctor={doctor} />
        </div>
    );
};

export default DocAvailability;

