import React, { useEffect } from "react";
import DoctorInterface from "../interfaces/Doctor";

interface DoctorDetailsProps {
  doctorLocation: DoctorInterface;
}

const GoogleLocation: React.FC<DoctorDetailsProps> = ({ doctorLocation }) => {
  useEffect(() => {
    const AOS = require("aos");
    AOS.init({ duration: 800, offset: 200, easing: "ease-in-out" });
    return () => {
      AOS.refresh();
    };
  }, []);

  return (
    <div className="align marginSide" data-aos="fade-up">
      <p className="h4" id="location">
        Office Location
      </p>
      <div>
        <iframe
          src={`https://maps.google.com/maps?q=${doctorLocation.location.latitude},${doctorLocation.location.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          width={800}
          height={400}
        ></iframe>
      </div>
    </div>
  );
};

export default GoogleLocation;
