import React, { useState } from 'react';
import { Doctor } from '../types/DoctorTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { fetchSlotDetails } from '../api';
import { RootState } from '../store';
import { selectUser } from '../store/slices/login_slice';
import { useSelector } from "react-redux";

interface AvailabilityGridProps {
    availabilitySummary: { [date: string]: number }; // Updated structure
    doctor: Doctor;
}

interface Slot {
    start: string;
    end: string;
}

const AvailabilityGrid: React.FC<AvailabilityGridProps> = ({ availabilitySummary, doctor }) => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);
    const [selectedDay, setSelectedDay] = useState<{ date: Date; slots: Slot[] } | null>(null);
    const startDate = new Date();
    const [slots, setSlots] = useState<Slot[]>([]);
    const maxRangeInDays = 28; // Adjust as needed
    const [weekOffset, setWeekOffset] = useState(0);

    const getNextFourWeeksDates = (start: Date): Date[] => {
        let dates: Date[] = [];
        for (let i = 0; i < maxRangeInDays; i++) {
            let date = new Date(start);
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const handleNextWeeks = () => {
        setWeekOffset((prevOffset) => prevOffset + 1);
    };

    const handlePreviousWeeks = () => {
        setWeekOffset((prevOffset) => prevOffset - 1);
    };

    function convertUtcToEstAndFormat(slots: Slot[]) {
        const utcToEstOffset = -5; // EST is UTC-5 hours
        const estSlots = slots.map(slot => {
            return {
                start: convertAndFormatTime(slot.start, utcToEstOffset),
                end: convertAndFormatTime(slot.end, utcToEstOffset)
            };
        });
        return estSlots;
    }

    function convertAndFormatTime(dateTimeString: string, offset: number) {
        const date = new Date(dateTimeString);
        date.setHours(date.getHours() + offset);
        return date.toISOString().substring(11, 16); // Extracts the HH:MM part
    }


    const handleCellClick = async (date: Date) => {
        setSelectedDay({ date, slots: [] });
        try {
            const slotDetails = await fetchSlotDetails(doctor.id.toString(), date);

            setSlots(convertUtcToEstAndFormat(slotDetails));


        } catch (error) {
            console.error("Error fetching slot details: ", error);
            setSlots([]);
        }
    };

    const handleBookingClick = (doctorId: number, slot: Slot, date: Date) => {
        if (user.user === null) {
            window.location.href = "/login";
        }
        else {
            navigate('/booking', { state: { doctorId, slot, date } });
        }
    };

    const isSlotTimePast = (end: string, date: Date) => {
        const currentTime = new Date();
        const endTime = new Date();
        if (date > currentTime) {
            return false;
        }
        // Extract hours and minutes from slot.end and set them to endTime
        const [hours, minutes] = end.split(':').map(Number);
        endTime.setHours(hours, minutes, 0, 0); // Reset seconds and milliseconds to 0

        // Compare and return if current time is past slot end time
        return currentTime > endTime;
    };

    const renderPopup = () => {
        if (!selectedDay) return null;

        return (
            <>
                <div className="modal-backdrop show"></div>
                <div className="modal show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Available Slots on {selectedDay.date.toDateString()}</h5>
                                <span aria-hidden="true" className="modal-close-icon" onClick={() => setSelectedDay(null)}>&times;</span>
                            </div>
                            <div className="modal-body">
                                {slots.length > 0 ? (
                                    slots.map((slot, index) => (
                                        <div key={index} className="d-flex justify-content-between align-items-center">
                                            <span>{slot.start} - {slot.end}</span>
                                            <button
                                                onClick={() => handleBookingClick(doctor.id, slot, selectedDay.date)}
                                                disabled={isSlotTimePast(slot.end, selectedDay.date)} // Disable button if current time is past slot.end
                                                className={`btn ${isSlotTimePast(slot.end, selectedDay.date) ? 'button-disabled' : ''}`}
                                            >
                                                Book Now
                                            </button>
                                        </div>))
                                ) : (
                                    <div>No available slots</div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setSelectedDay(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderWeekRow = (weekDates: Date[]): JSX.Element[] => {
        return weekDates.map((date, index) => {
            const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' }); // e.g., "Wed"
            const month = date.toLocaleString('en-US', { month: 'short' }); // e.g., "Dec"
            const dayOfMonth = date.getDate(); // e.g., 13
            const availableAppointments = availabilitySummary[date.toLocaleDateString('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })] || 0;

            return (
                <div key={index} className="availability-row col" onClick={() => handleCellClick(date)}>
                    <div className="availability-cell p-1 border rounded text-center">
                        <div>{dayOfWeek}</div>
                        <div>{month} {dayOfMonth}</div>
                        <div><strong>{availableAppointments}</strong></div>
                        <div>appts</div>
                    </div>
                </div>
            );
        });
    };

    const renderNavigationButtons = () => {
        const startIndex = weekOffset * 14;
        const displayedWeeks = dates.slice(startIndex, startIndex + 14);

        // Get the start and end date of the current two-week period
        const startDateRange = displayedWeeks[0];
        const endDateRange = displayedWeeks[13];

        // Format dates for display
        const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const dateRangeString = `${formatDate(startDateRange)} - ${formatDate(endDateRange)}`;

        return (
            <div className="date-navigation">
                <button onClick={handlePreviousWeeks} disabled={weekOffset === 0}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <span><strong>{dateRangeString}</strong></span> {/* Displaying the date range */}
                <button onClick={handleNextWeeks} disabled={weekOffset === 1}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        );
    };


    const dates = getNextFourWeeksDates(startDate);
    const startIndex = weekOffset * 14; // 0 for the first two weeks, 14 for the next two
    const displayedWeeks = dates.slice(startIndex, startIndex + 14);


    return (
        <div>
            {renderNavigationButtons()}
            <div className="row g-2 mb-1">{renderWeekRow(displayedWeeks.slice(0, 7))}</div>
            <div className="row g-2">{renderWeekRow(displayedWeeks.slice(7, 14))}</div>
            {renderPopup()}
        </div>
    );
};

export default AvailabilityGrid;
