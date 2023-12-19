import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Doctor } from '../types/DoctorTypes';
import { createAppointment, fetchDoctorDetails } from '../api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../Css/bookingPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import patientImage from '../media/vecteezy_covid19-vaccine-illustration1_SS0321.jpg'
import ImageAndText from '../components/ImageAndText';
import appointmentImage from '../media/vecteezy_covid19-vaccine-illustration1_SS0321.jpg';
import DocBookHeader from '../components/DocBookHeader';
import { useSelector } from "react-redux";
import { selectPatient } from '../store/slices/patient_slice';
import Footer from '../components/Footer';

interface BookingFormData {
    name: string;
    email: string;
    condition: string;
    insuranceProvider: string;
    insuranceNumber: string;
}

const BookingPage: React.FC = () => {
    const [bookingStatus, setBookingStatus] = useState<{ status: 'idle' | 'success' | 'error', message: string }>({ status: 'idle', message: '' });
    const [formData, setFormData] = useState<BookingFormData>({
        name: '',
        email: '',
        condition: '',
        insuranceProvider: '',
        insuranceNumber: ''
    });
    const location = useLocation();
    const { doctorId, slot, date } = location.state || {};

    const [doctor, setDoctor] = useState<Doctor | null>(null);

    const userData = useSelector(selectPatient);

    useEffect(() => {
        if (userData) {
            setFormData({
                ...formData,
                name: userData.name,
                email: userData.email,
                insuranceProvider: userData.insurance ?? '',
            });
        }
    }, [userData, setFormData]);

    useEffect(() => {
        const fetchAndSetDoctor = async () => {
            if (doctorId) {
                const doctorData = await fetchDoctorDetails(doctorId);
                setDoctor(doctorData);
            }
        };

        fetchAndSetDoctor();
    }, [doctorId]);

    useEffect(() => {
        AOS.init({
            duration: 2000
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    function combineDateAndTime(dateString: string, timeString: string) {
        console.log(dateString, timeString);
        let dateTimeString = dateString + 'T' + timeString + ':00-05:00';
        const date = new Date(dateTimeString);
        return date;
    }


    const validateForm = () => {
        const missingFields: string[] = [];
        Object.entries(formData).forEach(([key, value]) => {
            if (!value.trim()) missingFields.push(key);
        });
        return missingFields;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const missingFields = validateForm();
        if (missingFields.length > 0) {
            setBookingStatus({
                status: 'error',
                message: `Please fill in the following fields: ${missingFields.join(', ')}.`
            });
            return;
        }

        const formattedDate = date.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        console.log(formattedDate, slot.start, slot.end);

        const appointmentData = {
            ...formData,
            doctorId: doctorId,
            startTime: combineDateAndTime(formattedDate, slot.start),
            endTime: combineDateAndTime(formattedDate, slot.end),
            date: formattedDate
        };

        try {
            const result = await createAppointment(appointmentData);
            console.log('Appointment created:', result);
            setBookingStatus({ status: 'success', message: 'Appointment successfully booked!' });
            // Additional success handling
        } catch (error) {
            console.error('Error creating appointment:', error);
            setBookingStatus({ status: 'error', message: `${error}` });
            // Additional error handling
        }


    };




    return (
        <>
            <DocBookHeader></DocBookHeader>
            <div className='mb-5'>
                <div className="booking-container container-fluid" data-aos="fade-up">
                    <div className="row h-100">
                        <div className="col-md-6 left-column" style={{ backgroundImage: `url(${patientImage})` }}>
                            {/* Left column with background image */}
                        </div>
                        <div className="col-md-6 right-column d-flex align-items-center justify-content-center">
                            <div className="form-container">
                                <div className='info'>
                                    {bookingStatus.status !== 'idle' && (
                                        <div
                                            className={`alert ${bookingStatus.status === 'success' ? 'alert-success' : 'alert-danger'}`}
                                            role="alert"
                                        >
                                            <FontAwesomeIcon icon={bookingStatus.status === 'success' ? faCheckCircle : faTimesCircle} /> {bookingStatus.message}
                                        </div>
                                    )}
                                </div>
                                <div className="card form-card">
                                    <div className="card-body">
                                        <div className="container my-5">
                                            {doctor && (
                                                <div className="mb-4">
                                                    <h2 className="mb-3">Booking Appointment with {doctor.name}</h2>
                                                    <p><strong>Specialty:</strong> {doctor.specialty}</p>
                                                    <p><strong>Location:</strong> {doctor.address}</p>
                                                    <p><strong>Selected Slot:</strong> {slot.start} - {slot.end} </p>
                                                </div>
                                            )}
                                            <h3 className="mb-4">Appointment Details</h3>
                                            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="name">Your Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="name"
                                                            name="name"
                                                            value={formData.name || userData?.name}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                        <div className="invalid-feedback">
                                                            Name is required.
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="email">Email</label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            name="email"
                                                            value={formData.email || userData?.email}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                        <div className="invalid-feedback">
                                                            Please enter a valid email.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="condition">Condition Description</label>
                                                    <textarea
                                                        className="form-control"
                                                        id="condition"
                                                        name="condition"
                                                        value={formData.condition}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <div className="invalid-feedback">
                                                        Please describe your condition.
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="insuranceProvider">Insurance Provider</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="insuranceProvider"
                                                            name="insuranceProvider"
                                                            value={formData.insuranceProvider || userData?.insurance}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="insuranceNumber">Insurance Number</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="insuranceNumber"
                                                            name="insuranceNumber"
                                                            value={formData.insuranceNumber}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <button className="btn btn-primary" type="submit">Book Appointment</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>



    );
};

export default BookingPage;