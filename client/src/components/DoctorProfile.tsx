import React from 'react';
import DoctorInfo from './DoctorInfo';
import { Doctor } from '../types/DoctorTypes';


// Define the type for the props
interface DoctorProfileProps {
    doctors: Doctor[];
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctors }) => {
    if (!doctors || doctors.length === 0) {
        return <p>No doctors found.</p>;
    }

    return (
        <div>
            {doctors.map(doctor => (
                <DoctorInfo key={doctor.id} doctor={doctor} />
            ))}
        </div>
    );
};

export default DoctorProfile;
