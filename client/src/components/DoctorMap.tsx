import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Doctor } from '../types/DoctorTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import ReactDOMServer from 'react-dom/server';

interface DoctorMapProps {
    doctors: Doctor[];
}

const doctorIcon = new L.Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(
        ReactDOMServer.renderToStaticMarkup(
            <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" color="red" />
        )
    )}`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

const MapBoundsSetter: React.FC<DoctorMapProps> = ({ doctors }) => {
    const map = useMap();

    useEffect(() => {
        if (doctors.length > 0) {
            const bounds = L.latLngBounds(doctors.map((doctor: Doctor) => [doctor.location.latitude, doctor.location.longitude]));
            map.fitBounds(bounds);
        }
    }, [doctors, map]);

    return null;
};

const DoctorMap: React.FC<DoctorMapProps> = ({ doctors }) => {
    const [userPosition, setUserPosition] = useState<[number, number]>([51.505, -0.09]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserPosition([position.coords.latitude, position.coords.longitude]);
            },
            () => {
                console.error("Error getting user's location");
            }
        );
    }, []);

    return (
        <MapContainer center={userPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {doctors.map((doctor) => (
                <Marker key={doctor.id} position={[doctor.location.latitude, doctor.location.longitude]} icon={doctorIcon}>
                    <Popup>
                        <div>
                            <h3>{doctor.name}</h3>
                            <p>{doctor.specialty}</p>
                            <p>{doctor.address}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
            <MapBoundsSetter doctors={doctors} />
        </MapContainer>
    );
};

export default DoctorMap;
