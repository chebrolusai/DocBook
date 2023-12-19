import React, { useState, ChangeEvent, FormEvent, useRef, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import mapPin from "../media/map_pin.png";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { useNavigate } from "react-router-dom";
import DocBookHeader from "./DocBookHeader";
import { useTranslation } from "react-i18next";
interface FormData {
 username: string;
 password:string;
 name: string;
 specialty: string;
 address: string;
  location: {
    latitude: number;
    longitude: number;
  };
 email: string;
 rating: number;
 profilePicture: string;
 availability: {
 monday: string[];
 tuesday: string[];
 wednesday: string[];
 thursday: string[];
 friday: string[];
 };
 insuranceProviders: string[];
 education: {
 degree: string;
 university: string;
 }[];
 experience: {
 position: string;
 hospital: string;
 duration: string;
 }[];
 about: string;
}
const initialLocation = {
  latitude: 0,
  longitude: 0,
};
const DoctorRegistrationForm: React.FC = () => {
 const mapRef = useRef<any>(null);
 const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
 const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
 const [errorMessage, setErrorMessage] = useState<string | null>(null);
 const [message, setMessage] = useState('');
 const navigate = useNavigate();
 const { t, i18n, ready } = useTranslation("common", { useSuspense: false });
 const [formData, setFormData] = useState<FormData>({
 username: "",
 password: "",
 name: "",
 specialty: "",
 address: "",
 email: "",
 rating: 0,
 profilePicture: "",
 availability: {
 monday: [],
 tuesday: [],
 wednesday: [],
 thursday: [],
 friday: [],
 },
 location: { ...initialLocation },
 insuranceProviders: [],
 education: [{ degree: "", university: "" }],
 experience: [{ position: "", hospital: "", duration: "" }],
 about: "",
 });

 const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    setProfilePictureFile(e.target.files[0]);
  }
};

 const handleInputChange = (
 e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
 ) => {
 const { id, value, name,type} = e.target;
  if(id === "username") {
    const isValidUsername = /^[a-zA-Z0-9]+$/.test(value);
    if (!isValidUsername) {
      setErrorMessage(
        "Invalid characters in username. Only alphanumeric characters are allowed."
      );
      return;
    }
  }
  setErrorMessage(null);
      if (name?.startsWith("degree") || name?.startsWith("university")) {
         // Handle changes for education
         const index = Number(name.match(/\d+/)?.[0] ?? 0);
         setFormData((prevData) => ({
         ...prevData,
         education: prevData.education.map((edu, i) =>
         i === index ? { ...edu, [name]: value } : edu
         ),
         }));
        } else if (name?.startsWith("position") || name?.startsWith("hospital") || 
        name?.startsWith("duration")) {
         // Handle changes for experience
         const index = Number(name.match(/\d+/)?.[0] ?? 0);
         setFormData((prevData) => ({
         ...prevData,
         experience: prevData.experience.map((exp, i) =>
         i === index ? { ...exp, [name]: value } : exp
         ),
         }));
         } else if (name?.startsWith("insuranceProvider")) {
                // Handle changes for insurance providers
                const index = Number(name.match(/\d+/)?.[0] ?? 0);
                setFormData((prevData) => ({
                ...prevData,
                insuranceProviders: prevData.insuranceProviders.map((provider, i) =>
                i === index ? value : provider
                ),
                }));
                } else {
                // Handle other input changes
                setFormData((prevData) => ({
                ...prevData,
                [id]: value,
                }));
                }
                };
              
 const handleEducationChange = (
 e: ChangeEvent<HTMLInputElement>,
 index: number,
 field: "degree" | "university"
 ) => {
 const { value } = e.target;
 setFormData((prevData) => ({
 ...prevData,
 education: prevData.education.map((edu, i) =>
 i === index ? { ...edu, [field]: value } : edu
 ),
 }));
 };
 const handleAddEducation = () => {
 setFormData((prevData) => ({
 ...prevData,
 education: [...prevData.education, { degree: "", university: "" }],
 }));
 };
 const handleRemoveEducation = (index: number) => {
 setFormData((prevData) => ({
 ...prevData,
 education: prevData.education.filter((edu, i) => i !== index),
 }));
 };
 const handleExperienceChange = (
 e: ChangeEvent<HTMLInputElement>,
 index: number,
 field: "position" | "hospital" | "duration"
 ) => {
 const { name, value } = e.target;
 setFormData((prevData) => ({
 ...prevData,
 experience: prevData.experience.map((exp, i) =>
 i === index ? { ...exp, [field]: value } : exp
 ),
 }));
 };

 const handleAddExperience = () => {
 setFormData((prevData) => ({
 ...prevData,
 experience: [...prevData.experience, { position: "", hospital: "", duration: "" }],
 }));
 };
 const handleRemoveExperience = (index: number) => {
 setFormData((prevData) => ({
 ...prevData,
 experience: prevData.experience.filter((exp, i) => i !== index),
 }));
 };
 const handleInsuranceProviderChange = (
 e: ChangeEvent<HTMLInputElement>,
 index: number
 ) => {
 const { value } = e.target;
 setFormData((prevData) => ({
 ...prevData,
 insuranceProviders: prevData.insuranceProviders.map((provider, i) =>
 i === index ? value : provider
 ),
 }));
 };

 const handleAddInsuranceProvider = () => {
 setFormData((prevData) => ({
 ...prevData,
 insuranceProviders: [...prevData.insuranceProviders, ""],
 }));
 };

 const handleRemoveInsuranceProvider = (index: number) => {
 setFormData((prevData) => ({
 ...prevData,
 insuranceProviders: prevData.insuranceProviders.filter((provider, i) => i !== index),
 }));
 };
 const handleMapClick = (e: any) => {
  const { lat, lng } = e.latlng;
  console.log("Latitude:", lat);
  console.log("Longitude:", lng);

  // Update form data with new latitude and longitude
  setFormData((prevData) => ({
    ...prevData,
    location: {
      latitude: lat,
      longitude: lng,
      // L.marker([lat,lng]),
    }
  }));

  // Assuming you have a state named 'coordinates', set it here
  setCoordinates([lat, lng]);
};

 const handleMapReady = () => {
 console.log("Map is ready!");
 if (mapRef.current) {
 console.log("Map object:", mapRef.current);
 }
 };
 const MapClickHandler = () => {
 const map = useMapEvents({
 click: handleMapClick,
 });
 useEffect(() => {
 mapRef.current = map;
 }, [map]);
 return null;
 };

 const handleAddressChange = async (e: ChangeEvent<HTMLInputElement>) => {
  const address = e.target.value;
  setFormData((prevData) => ({
    ...prevData,
    address,
  }));

  try {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: address });

    if (results.length > 0) {
      const { x, y } = results[0];
      setCoordinates([y, x]);
      setFormData((prevData) => ({
        ...prevData,
        location: {
          latitude: y,
          longitude: x,
        }
      }));
      mapRef.current?.flyTo([y, x], 15);
    } else {
      setCoordinates(null);
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }
};

 const customIcon = new L.Icon({
  iconUrl: mapPin,
  iconSize: [25, 25], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
});


 const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("clicked submit");
  console.log(formData.username);
  console.log(formData.password);
   console.log(formData.name);
   console.log(formData.email);
   console.log(formData.specialty);
   console.log(formData.availability);
   console.log(formData.profilePicture);
   console.log(formData.location);
   console.log(formData.education);
   console.log(formData.experience);
  try {
    const formDataToSend = {
      username: formData.username,
      password: formData.password,
      name: formData.name,
      specialty: formData.specialty,
      address: formData.address,
      location: formData.location,
      email: formData.email,
      rating: formData.rating, // Assuming you have this field in formData
      insuranceProviders: formData.insuranceProviders,
      education: formData.education.map(edu => ({
          degree: edu.degree,
          university: edu.university,
      })),
      experience: formData.experience.map(exp => ({
          position: exp.position,
          hospital: exp.hospital,
          duration: exp.duration,
      })),
      about: formData.about, // Assuming you have this field in formData
  };

  const formdata = new FormData();
  formdata.append("data", JSON.stringify(formDataToSend));

  if (profilePictureFile) {
    formdata.append("profilePicture", profilePictureFile);
  }

    const response = await fetch("/doctor/create", {
      method: "POST",
      body: formdata
    });

    console.log(formData);
    if (response.ok) {
      setMessage("Doctor registered successfully!");
      setTimeout(() => navigate("/login"), 2000); 
    } else {
      console.error("Error registering doctor.");
    }
  } catch (error) {
    if (error instanceof Error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("An unexpected error occurred");
    }
  }
 };
 return (
 <> 
 <DocBookHeader></DocBookHeader>
 <div className="containerfluid mt-5 mb-5 ">
  <div className="row justify-content-center">
    <div className="col-lg-8">
      <div
        className="card p-4"
        style={{
        borderRadius: "15px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
        >
        <h2 className="text-center mb-4" style={{ color: "#007BFF" }}>
        {t("doctor.page.title")}
        </h2>
        {/* Registration Details */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
            <h4 style={{ color: "#495057" }}>{t("doctor.page.registration")}</h4>
            <div className="mb-3">
            <label htmlFor="username" className="form-label">
            {t("doctor.page.username")}
            </label>
            <input
            type="text"
            className="form-control"
            id="username"
            onChange={handleInputChange}
            required
        />
        {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
         )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
          {t("doctor.page.password")}
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">
            {t("doctor.page.name")}
            </label>
            <input
            type="text"
            className="form-control"
            id="name"
            onChange={handleInputChange}
            required
          />
          </div>
        <div className="mb-3">
            <label htmlFor="specialty" className="form-label">
            {t("doctor.page.speciality")}
            </label>
            <input
            type="text"
            className="form-control"
            id="specialty"
            onChange={handleInputChange}
            required
            />
          </div>
          </div>
            {/* Contact and Location */}
            <div className="mb-4">
            <h4 style={{ color: "#495057" }}>{t("doctor.page.candl")}</h4>
            <div className="mb-3">
            <label htmlFor="address" className="form-label">
            {t("doctor.page.address")}
            </label>
            <input
            type="text"
            className="form-control"
            id="address"
            onChange={handleAddressChange}
            required
            />
          </div>
          <div className="mb-3">
              <label htmlFor="map" className="form-label">
              {t("doctor.page.map")}
              </label>
              <MapContainer
              center={[37.7749, -122.4194]}
              zoom={13}
              style={{ height: "400px", width: "100%" }}
              whenReady={handleMapReady}
              >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClickHandler />
              {coordinates && <Marker position={coordinates} icon={customIcon} />}
              </MapContainer>
            </div>
            <div className="mb-3" style={{display:'none'}}>
              <label htmlFor="latitude" className="form-label">
                Latitude
              </label>
              <input
                type="text"
                className="form-control"
                id="latitude"
                value={formData.location.latitude}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <div className="mb-3" style={{display:'none'}}>
              <label htmlFor="longitude" className="form-label">
                Longitude
              </label>
              <input
                type="text"
                className="form-control"
                id="longitude"
                value={formData.location.longitude}
                onChange={handleInputChange}
                readOnly
              />
            </div>
          <div className="mb-3">
              <label htmlFor="email" className="form-label">
              {t("doctor.page.email")}
              </label>
              <input
              type="email"
              className="form-control"
              id="email"
              onChange={handleInputChange}
              required
              />
          </div>
          <div className="mb-3">
          <label htmlFor="profilePicture" className="form-label">
          {t("doctor.page.Profilepicture")}
          </label>
          <input
          type="file"
          className="form-control"
          id="profilePicture"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          required
          />
          </div>
          </div>
          {/* Availability */}
          <div className="mb-4" style={{display: 'none'}}>
              <h4 style={{ color: "#495057" }}>Availability</h4>
              <label htmlFor="availability" className="form-label">
              Availability
              </label>
              <input
              type="text"
              className="form-control"
              id="availability"
              onChange={handleInputChange}
          />
          </div>
              {/* Insurance Providers */}
              <div className="mb-4">
                  <h4 style={{ color: "#495057" }}>{t("doctor.page.insuranceproviders")}</h4>
                  {formData.insuranceProviders.map((provider, index) => (
                  <div key={index} className="mb-3">
                  <label htmlFor={`insuranceProvider${index}`} className="form-label">
                  Insurance Provider
                  </label>
                  <input
                  type="text"
                  id={`insuranceProvider${index}`}
                  name={`insuranceProvider${index}`}
                  value={provider}
                  className="form-control"
                  onChange={(e) => handleInsuranceProviderChange(e, index)}
                  />
              </div>
              ))}
              <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddInsuranceProvider}
              >
              {t("doctor.page.education")}
              </button>
              {formData.insuranceProviders.length > 1 && (
              <button
              type="button"
              className="btn btn-danger ms-2"
              //className="form-control"
              onClick={() => 
              handleRemoveInsuranceProvider(formData.insuranceProviders.length - 1)}
              >
              Remove Last Insurance Provider
              </button>
              )}
            </div>
                {/* Education */}
                <div className="mb-4">
                  <h4 style={{ color: "#495057" }}>{t("doctor.page.education")}</h4>
                  {formData.education.map((edu, index) => (
                  <div key={index} className="mb-3">
                      <label htmlFor={`degree${index}`} className="form-label">
                      {t("doctor.page.degree")}
                      </label>
                      <input
                      type="text"
                      id={`degree${index}`}
                      name={`degree${index}`}
                      value={edu.degree}
                      className="form-control"
                      onChange={(e) => handleEducationChange(e, index,"degree")}
                      />
                      <label htmlFor={`university${index}`} className="form-label">
                      {t("doctor.page.university")}
                      </label>
                      <input
                      type="text"
                      id={`university${index}`}
                      name={`university${index}`}
                      value={edu.university}
                      className="form-control"
                      onChange={(e) => handleEducationChange(e, index,"university")}
                      />
                </div>
                ))}
                <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddEducation}
                >
                {t("doctor.page.experiencebutton")}
                </button>
                {formData.education.length > 1 && (
                <button
                type="button"
                className="btn btn-danger ms-2"
                onClick={() => handleRemoveEducation(formData.education.length - 1)}
                >
                Remove Last Education
                </button>
                )}
                </div>

              {/* Experience */}
              <div className="mb-4">
                <h4 style={{ color: "#495057" }}>{t("doctor.page.experience")}</h4>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="mb-3">
                    <label htmlFor={`position${index}`} className="form-label">
                    {t("doctor.page.position")}
                    </label>
                    <input
                    type="text"
                    id={`position${index}`}
                    name={`position${index}`}
                    value={exp.position}
                    className="form-control"
                    onChange={(e) => handleExperienceChange(e, index,"position")}
                    />
                    <label htmlFor={`hospital${index}`} className="form-label">
                    {t("doctor.page.hospital")}
                    </label>
                    <input
                    type="text"
                    id={`hospital${index}`}
                    name={`hospital${index}`}
                    value={exp.hospital}
                    className="form-control"
                    onChange={(e) => handleExperienceChange(e, index,"hospital")}
                    />
                    <label htmlFor={`duration${index}`} className="form-label">
                    {t("doctor.page.duration")}
                    </label>
                    <input
                    type="text"
                    id={`duration${index}`}
                    name={`duration${index}`}
                    value={exp.duration}
                    className="form-control"
                    onChange={(e) => handleExperienceChange(e, index,"duration")}
                    />
                  </div>
                  ))}
                  <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddExperience}
                  >
                  {t("doctor.page.experiencebutton")}
                  </button>
                  {formData.experience.length > 1 && (
                  <button
                  type="button"
                  className="btn btn-danger ms-2"
                  //className="form-control"
                  onClick={() => handleRemoveExperience(formData.experience.length - 1)}
                  >
                  Remove Last Experience
                  </button>
                  )}
              </div>
              {/* About */}
              <div className="mb-4">
              <h4 style={{ color: "#495057" }}>{t("doctor.page.about")}</h4>
              <div className="mb-3">
                <label htmlFor="about" className="form-label">
                {t("doctor.page.about")}
                </label>
                <textarea
                className="form-control"
                id="about"
                onChange={handleInputChange}
                required
                ></textarea>
              </div>
            </div>
                <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                style={{ backgroundColor: "#007BFF", borderColor: "#007BFF" }}
                >
                {t("doctor.page.submit")}
                </button>
                {message && <div className="alert">{message}</div>}
          </form>
        </div>
      </div>
    </div>
 </div>
 </>
 );
};

export default DoctorRegistrationForm;