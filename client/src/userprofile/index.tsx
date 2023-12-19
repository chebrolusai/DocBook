import React, { useState, useEffect } from "react";
import Patient from "../interfaces/Patient";
import DoctorDetails from "../interfaces/Doctor";
import ImageAndText from "../components/ImageAndText";
import HelloImg from "./media/3568984.jpg";
import PatientDetails from "../components/PatientUserProfile";
import PatientAppointments from "../components/PatientUserAppointments";
import DoctorUserProfile from "../components/DoctorUserProfile";
import DocBookHeader from "../components/DocBookHeader";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/login_slice";
import { useDispatch } from "react-redux";
import { setPatient } from "../store/slices/patient_slice";
import { RootState } from "../store";
import Footer from "../components/Footer";

function Profile() {
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(
    null
  );

  const dispatch = useDispatch();
  const userType = useSelector(selectUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userType === "patient") {
          const response = await fetch("/patient");

          if (!response.ok) {
            throw new Error("Failed to fetch patient data");
          }

          const data = await response.json();
          setPatientData(data);
          dispatch(setPatient(data));
          console.log(data);
        } else if (userType === "doctor") {
          const doctorResponse = await fetch("/doctor/profile");

          if (!doctorResponse.ok) {
            throw new Error("Failed to fetch doctor details");
          }

          const doctorData = await doctorResponse.json();
          setDoctorDetails(doctorData);
          console.log(doctorData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (userType == null) {
          window.location.href = "/login";
        }
      }
    };

    fetchData();
  }, [dispatch, userType]);

  if (userType === null) {
    return null;
  }

  return (
    <>
      <DocBookHeader></DocBookHeader>
      {userType === "patient" ? (
        <>
          <PatientDetails patient={patientData} />
          <PatientAppointments />
        </>
      ) : (
        <>
          <DoctorUserProfile doctor={doctorDetails}></DoctorUserProfile>
        </>
      )}
      <div style={{marginBottom:"100px"}}></div>
      <Footer></Footer>
    </>
  );
}

export default Profile;
