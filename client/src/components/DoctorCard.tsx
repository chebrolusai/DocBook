import React from "react";
import StarRating from "./StarRating";
import DoctorInterface from "../interfaces/Doctor";
import profilePic from "../media/defaultdoc.png";

interface DoctorCardProps {
  doctor: DoctorInterface;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const profilePicture = doctor.profilePicture;
  return (
    <div className="profileContainer">
      <div className="pictureContainer">
        <img
          src={doctor.profilePicture || profilePic}
          alt="Profile"
          className="profilePic"
        />
      </div>
      <div className="infoContainer">
        <div className="doctorname" title={doctor.name}>
          {doctor.name}
        </div>
        <div className="specialty" title={doctor.specialty}>
          {doctor.specialty}
        </div>
        <div className="location">
          <img
            width="25"
            height="25"
            src="https://img.icons8.com/3d-fluency/94/map-pin.png"
            alt="map-pin"
          />
          <span>{doctor.address}</span>
        </div>
        <div className="rating">
          <StarRating numStars={1}></StarRating>
          <span className="ratingText">{doctor.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
