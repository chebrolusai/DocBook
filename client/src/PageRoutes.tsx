import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as RouterRoutes,
  Navigate,
  redirectDocument,
} from "react-router-dom";
import App from "./App";
import Login from "./login";
import Help from "./help";
import DoctorProfile from "./doctorprofile";
import PatientRegistrationForm from "./registerpatient";
import Profile from "./userprofile";
import DoctorSearchPage from "./search";
import BookingPage from "./booking";
import HomePage from "./home";
import DoctorRegistrationForm from "./components/DoctorRegistration";
import NotFoundComponent from "./components/NotFoundPage";

const Routes: React.FC = () => {
  return (
    <Router>
      <RouterRoutes>
        <Route
          path="/service-worker.js"
          element={<Navigate to={"/service-worker.js"} replace />}
        ></Route>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/help" element={<Help />} />
        <Route path="/doctorprofile/doctor/:id" element={<DoctorProfile />} />
        <Route path="/registerpatient" element={<PatientRegistrationForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<DoctorSearchPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/registerdoctor" element={<DoctorRegistrationForm />} />
        <Route path="*" element={<NotFoundComponent />} />
      </RouterRoutes>
    </Router>
  );
};

export default Routes;
