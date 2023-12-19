import React, { useEffect } from "react";
import DoctorInterface from "../interfaces/Doctor";

interface DoctorDetailsProps {
  doctor: DoctorInterface;
}

const DoctorInfoSection: React.FC<DoctorDetailsProps> = ({ doctor }) => {
  useEffect(() => {
    const AOS = require("aos");
    AOS.init({ duration: 800, offset: 200, easing: "ease-in-out", once: true });
    return () => {
      AOS.refresh();
    };
  }, []);

  return (
    <div className="align marginSide">
      <div className="container mt-5" data-aos="fade-up">
        <div className="row">
          <div className="col">
            <h1 className="display-4 mb-4">{doctor.name}</h1>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col">
            <h2>About</h2>
            <p>{doctor.about}</p>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col">
            <h2>Specialty</h2>
            <p>{doctor.specialty}</p>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col">
            <h2>Education</h2>
            <ul>
              {doctor.education.map((edu, index) => (
                <li key={index}>
                  <strong>{edu.degree}</strong> - {edu.university}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h2>Experience</h2>
            <ul>
              {doctor.experience.map((exp, index) => (
                <li key={index}>
                  <strong>{exp.position}</strong> at {exp.hospital} (
                  {exp.duration})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfoSection;
