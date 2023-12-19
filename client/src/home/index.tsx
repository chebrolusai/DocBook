import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import "../Css/Homepage.css"; // Importing the corresponding CSS file for styling
import Footer from "../components/Footer";
import DocBookHeader from "../components/DocBookHeader";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { faHospital } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";
import { SearchCriteria } from "../types/DoctorTypes";
import rightimg from "../media/right-img.png";
import qrimg from "../media/qr-img.png";
import AppStore from "../media/appstore.png";
import GoolgeStore from "../media/googleplay.png";
import Cardiologist from "../media/Cardiologist.jpg";
import Dentist from "../media/Dentist.jpg";
import OBGYN from "../media/OB-GYN.jpg";
import PrimaryCare from "../media/Primary Care.jpg";
import Psychiatrist from "../media/Psychiatrist.jpg";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";



interface User {
  location: {
    latitude: number;
    longitude: number;
  };
  id: number;
  username: string;
  name: string;
  specialty: string;
  address: string;
  email: string;
  rating: number;
  profilePicture: string;
  availability: {
    _id: string;
    slots: any[];
  }[];
  insuranceProviders: any[];
  education: {
    degree: string;
    university: string;
    _id: string;
  }[];
  experience: {
    position: string;
    hospital: string;
    duration: string;
    _id: string;
  }[];
  about: string;
  __v: number;
}

//Initialising the homepage
const HomePage = () => {
  const [searchParams, setSearchParams] = useState({
    name: "",
    specialty: "",
    location: "",
  });

  //Internationalisation variable
  const { t, i18n, ready } = useTranslation("common", { useSuspense: false });

  //Variables declared
  const [users, setUsers] = useState<User[]>([]);
  const minRating = 4.5; 
  const targetSpecialty = "Cardio";
  const targetSpecialty2 = "Dent";

  //Seach Bar function
  const navigateToDoctorSearch = (searchCriteria: SearchCriteria) => {
    navigate("/search", { state: { searchCriteria } });
  };

  // Function to fetch data
  const fetchData = async () => {
    try {
      const response = await fetch("/doctor/alldoc");
      const data = await response.json();
      setUsers(data.result); // Update users state with fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  // Function to filter users based on rating
  const filterUsersByRating = () => {
    return users.filter((user) => user.rating >= minRating);
  };

  const filteredUsersByRating = filterUsersByRating();

  //Function to filter based on specialty
  const filterUsersBySpecialty = (tar: string) => {
    //return users.filter((user) => user.specialty === tar);

    return users.filter((user) => {
      const regex = new RegExp(tar, 'i'); // 'i' for case-insensitive matching
      return regex.test(user.specialty);
    });
  };

  //Functions for Cardiologists, Dentists 
  const filteredUsersBySpecialty = filterUsersBySpecialty(targetSpecialty);
  const filteredUsersBySpecialty2 = filterUsersBySpecialty(targetSpecialty2);

  //Navigation to other pages
  const navigate = useNavigate();

  const handleCardClick = (doctorId: number) => {
    navigate(`/doctorprofile/doctor/${doctorId}`);
  };

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };
  

  const doctorScrollRef = useRef<HTMLDivElement | null>(null);
  const dentistScrollRef = useRef<HTMLDivElement | null>(null);
  const cardioScrollRef = useRef<HTMLDivElement | null>(null);


  //Scroll functionalities
  const scrollLeft = (ref: React.RefObject<HTMLDivElement> | null) => {
    if (ref && ref.current) {
      ref.current.scrollTo({
        left: ref.current.scrollLeft - 200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement> | null) => {
    if (ref && ref.current) {
      ref.current.scrollTo({
        left: ref.current.scrollLeft + 200,
        behavior: "smooth",
      });
    }
  };


  return (
    <div className="homepage">
        <div className="upper">
            <DocBookHeader></DocBookHeader>
            <div className='uppertext'>{t("home.page.title")}</div>
            <div className='searchframe'>
                <div className="search-bar">
                    <div className="search-icon">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <input
                    type="text"
                    className="mb-2"
                    placeholder="Location"
                    name="location"
                    value={searchParams.location}
                    onChange={handleSearchChange}
                    />
                    <div className="search-icon">
                        <FontAwesomeIcon icon={faHospital} />
                    </div>
                    <input
                    type="text"
                    className="mb-2"
                    placeholder="Specialty"
                    name="specialty"
                    value={searchParams.specialty}
                    onChange={handleSearchChange}
                    />
                    <div className="search-icon">
                        <FontAwesomeIcon icon={faUserDoctor} />
                    </div>
                    <input
                    type="text"
                    className="mb-2"
                    placeholder="Name"
                    name="name"
                    value={searchParams.name}
                    onChange={handleSearchChange}
                    />
                    <button onClick={(e) => {
                    e.preventDefault();
                    navigateToDoctorSearch(searchParams);
                }} className="btn btn-primary search-btn">
                    <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            </div>
        </div>
        <div className="doctor-profiles">
            <div className="docrow-display">
                <div className="doctor-row-label">
                    {t("home.page.toprated")}
                <h3> {t("home.page.toprdesc")}</h3>
                </div>
                <div className="doctor-row">
                    <div className="doctor-cards" ref={doctorScrollRef}>
                        {filteredUsersByRating.map(user => (
                          <div className="carddoc doctor-card" key={user.id} onClick={() => handleCardClick(user.id)}>
                            <div className="card-header">
                              <img src={user.profilePicture} alt={`${user.name}`} className="profile-image" />
                              <div className="main-head">
                                <div className="profile-name">{user.name}</div>
                                <div className="star-rating">{/* Render stars here based on user.rating */}</div>
                                <div className="reviews">{user.specialty}</div>
                              </div>
                            </div>
                            <div className="card-body">
                              <h2 className="card-title"><FontAwesomeIcon icon={faStar} /> {user.rating} Rating</h2>
                              <p className="card-title2"><FontAwesomeIcon icon={faEnvelope} /> {user.email}</p>
                              <div className="card-text">{user.experience.map(value => (
                                <div className="exp">
                                  <p>{value.duration} In {value.hospital}</p>
                                </div>
                              ))}</div>
                            </div>
                          </div>
                        ))}   
                    </div>
                    <div className="scroll-arrows">
                        <button
                        onClick={() => scrollLeft(doctorScrollRef)}
                        className="scroll-left"
                        >
                        <FontAwesomeIcon icon={faCircleArrowLeft} />
                        </button>
                        <button
                        onClick={() => scrollRight(doctorScrollRef)}
                        className="scroll-right"
                        >
                        <FontAwesomeIcon icon={faCircleArrowRight} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="docrow-display">
                <div className="doctor-row-label">{t("home.page.dentist")}</div>
                <div className="doctor-row">
                    <div className="doctor-cards" ref={dentistScrollRef}>
                        {filteredUsersBySpecialty2.map(user => (
                          <div className="carddoc doctor-card" key={user.id} onClick={() => handleCardClick(user.id)}>
                            <div className="card-header">
                              <img src={user.profilePicture} alt={`${user.name}`} className="profile-image" />
                              <div className="main-head">
                                <div className="profile-name"> {user.name}</div>
                                <div className="reviews">{user.specialty}</div>
                              </div>
                            </div>
                            <div className="card-body">
                              <h2 className="card-title"><FontAwesomeIcon icon={faStar} /> {user.rating} Rating</h2>
                              <p className="card-title2"><FontAwesomeIcon icon={faEnvelope} /> {user.email}</p>
                              <div className="card-text">{user.experience.map(value => (
                                <div className="exp">
                                  <p>{value.duration} In {value.hospital}</p>
                                </div>
                              ))}</div>
                            </div>
                          </div>
                        ))}   
                        
                    </div>
                    <div className="scroll-arrows">
                        <button
                        onClick={() => scrollLeft(dentistScrollRef)}
                        className="scroll-left"
                        >
                        <FontAwesomeIcon icon={faCircleArrowLeft} />
                        </button>
                        <button
                        onClick={() => scrollRight(dentistScrollRef)}
                        className="scroll-right"
                        >
                        <FontAwesomeIcon icon={faCircleArrowRight} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="docrow-display">
                <div className="doctor-row-label">{t("home.page.cardiologists")}</div>
                <div className="doctor-row">
                    <div className="doctor-cards" ref={cardioScrollRef}>
                        {filteredUsersBySpecialty.map(user => (
                          <div className="carddoc doctor-card" key={user.id} onClick={() => handleCardClick(user.id)}>
                            <div className="card-header">
                              <img src={user.profilePicture} alt={` ${user.name}`} className="profile-image" />
                              <div className="main-head">
                                <div className="profile-name">{user.name}</div>
                                <div className="star-rating">{/* Render stars here based on user.rating */}</div>
                                <div className="reviews">{user.specialty}</div>
                              </div>
                            </div>
                            <div className="card-body">
                              <h2 className="card-title"><FontAwesomeIcon icon={faStar} /> {user.rating} Rating</h2>
                              <h2 className="card-title2"><FontAwesomeIcon icon={faEnvelope} /> {user.email}</h2>
                              <div className="card-text">{user.experience.map(value => (
                                <div className="exp">
                                  <p>{value.duration} In {value.hospital}</p>
                                </div>
                              ))}</div>
                            </div>
                            {/* <div className="carddoc-footer">
                              Check Availablity
                            </div> */}
                          </div>
                        ))}   
                        
                    </div>
                    <div className="scroll-arrows">
                        <button
                        onClick={() => scrollLeft(cardioScrollRef)}
                        className="scroll-left"
                        >
                        <FontAwesomeIcon icon={faCircleArrowLeft} />
                        </button>
                        <button
                        onClick={() => scrollRight(cardioScrollRef)}
                        className="scroll-right"
                        >
                        <FontAwesomeIcon icon={faCircleArrowRight} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="doctor-spec">
            <div className="doctor-row-label">{t("home.page.spec.title")}</div>
            <div className="specialty-cards">
                <a href="/search" onClick={(e) => {
                    e.preventDefault();
                    navigateToDoctorSearch({name:"",specialty: "Primary Care", location:""});
                }} className="specialty-card-link">
                <div className="specialty-card">
                    <img src={PrimaryCare}></img>
                    <div className="specialty-name">{t("home.page.speccard.pc")}</div>
                </div>
                </a>

          <a
            href="/search"
            onClick={(e) => {
              e.preventDefault();
              navigateToDoctorSearch({
                name: "",
                specialty: "Dental",
                location: "",
              });
            }}
            className="specialty-card-link"
          >
            <div className="specialty-card">
              <img src={Dentist}></img>
              <div className="specialty-name">{t("home.page.speccard.den")}</div>
            </div>
          </a>

          <a
            href="/search"
            onClick={(e) => {
              e.preventDefault();
              navigateToDoctorSearch({
                name: "",
                specialty: "OB-GYN",
                location: "",
              });
            }}
            className="specialty-card-link"
          >
            <div className="specialty-card">
              <img src={OBGYN}></img>
              <div className="specialty-name">{t("home.page.speccard.ob")}</div>
            </div>
          </a>

          <a
            href="/search"
            onClick={(e) => {
              e.preventDefault();
              navigateToDoctorSearch({
                name: "",
                specialty: "Psychiatry",
                location: "",
              });
            }}
            className="specialty-card-link"
          >
            <div className="specialty-card">
              <img src={Psychiatrist}></img>
              <div className="specialty-name">{t("home.page.speccard.psy")}</div>
            </div>
          </a>

          <a
            href="/search"
            onClick={(e) => {
              e.preventDefault();
              navigateToDoctorSearch({
                name: "",
                specialty: "Cardio",
                location: "",
              });
            }}
            className="specialty-card-link"
          >
            <div className="specialty-card">
              <img src={Cardiologist}></img>
              <div className="specialty-name">{t("home.page.speccard.car")}</div>
            </div>
          </a>
        </div>
      </div>
      <div className="information-section">
        <div className="left-content">
          <h2 className="left-title">{t("home.page.info.title1")}</h2>
          <h2>{t("home.page.info.title2")}</h2>
          <p className="left-text">
            {t("home.page.info.desc")}
          </p>
          <img src={qrimg} alt="Content Image" className="left-image" />
          <div className="buttons-container">
            <a
              href="https://apps.apple.com/us/app/zocdoc/id391062219"
              target="_blank"
            >
              <img src={AppStore} className="app" alt="App Store" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.zocdoc.android"
              target="_blank"
            >
              <img src={GoolgeStore} className="app" alt="Google Play" />
            </a>
          </div>
        </div>
        <div className="right-content">
          <img src={rightimg} alt="Large Image Icon" className="large-image" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
