import React, { useEffect, useState } from "react";
import Patient from "../interfaces/Patient";
import ImageAndText from "../components/ImageAndText";
import HelloImg from "../media/3568984.jpg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/login_slice";
import { RootState } from "../store";
import { clearPatient } from "../store/slices/patient_slice";
import { useTranslation } from "react-i18next";

interface PatientDetailsProps {
  patient: Patient | null;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient }) => {
  const { t, i18n, ready } = useTranslation("common", { useSuspense: false });
  const [showModal, setShowModal] = useState(false);
  const [editedPatient, setEditedPatient] = useState({
    email: "",
    phone: "",
    insurance: "",
    height: "",
    weight: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (patient) {
      setEditedPatient({
        email: patient.email,
        phone: patient.phone.toString(),
        insurance: patient.insurance || "",
        height: patient.height ? patient.height.toString() : "",
        weight: patient.weight ? patient.weight.toString() : "",
      });
    }
  }, [patient]);

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };
  const handleShowModal = () => {
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };
  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/patient", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedPatient),
      });

      if (!response.ok) {
        throw new Error("Failed to update patient data");
      }
      const updatedPatientData = await response.json();

      console.log("Updated Patient Data:", updatedPatientData);

      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error("Error updating patient data");
    }
    setShowModal(false);
  };
  useEffect(() => {
    const AOS = require("aos");
    AOS.init({ duration: 800, offset: 200, easing: "ease-in-out" });
    return () => {
      AOS.refresh();
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearPatient());
    window.location.href = "/login";
  };

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  };

  return (
    <>
      <div
        className={`modal fade${showModal ? " show" : ""}`}
        aria-labelledby="contained-modal-title-vcenter"
        style={{
          display: showModal ? "block" : "none",
          backdropFilter: "blur(3px)",
        }}
        tabIndex={-1}
        aria-hidden={!showModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="editProfileModal">
                {t("profile.page.editprofile")}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3 text-start fs-5">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={editedPatient.email}
                    onChange={(e) =>
                      setEditedPatient({
                        ...editedPatient,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3 text-start fs-5">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    value={editedPatient.phone}
                    onChange={(e) =>
                      setEditedPatient({
                        ...editedPatient,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3 text-start fs-5">
                  <label htmlFor="height" className="form-label">
                    Height
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="height"
                    value={editedPatient.height}
                    onChange={(e) =>
                      setEditedPatient({
                        ...editedPatient,
                        height: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3 text-start fs-5">
                  <label htmlFor="weight" className="form-label">
                    Weight
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="weight"
                    value={editedPatient.weight}
                    onChange={(e) =>
                      setEditedPatient({
                        ...editedPatient,
                        weight: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3 text-start fs-5">
                  <label htmlFor="insurance" className="form-label">
                    Insurance
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="insurance"
                    value={editedPatient.insurance}
                    onChange={(e) =>
                      setEditedPatient({
                        ...editedPatient,
                        insurance: e.target.value,
                      })
                    }
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveChanges}
              >
                Submit
              </button>
              {/* Add a button for saving changes if needed */}
            </div>
          </div>
        </div>
      </div>
      <ImageAndText
        imagePath={HelloImg}
        text={`${t("profile.page.hi")}, ${patient?.name}`}
      ></ImageAndText>
      <div className="container mt-4" data-aos="fade-up">
        <button
          type="button"
          className="btn btn-outline-danger position-absolute end-0 top-0 m-4"
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-box-arrow-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
            ></path>
            <path
              fill-rule="evenodd"
              d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
            ></path>
          </svg>
          {t("profile.page.logout")}
        </button>
        {patient ? (
          <div>
            <h5 className="mb-4" style={{ fontSize: "2.5rem" }}>
              {t("profile.page.yourdetails")}
              <button
                type="button"
                className="btn btn-outline-primary m-4"
                onClick={handleShowModal}
              >
                {t("profile.page.editprofile")}
              </button>
            </h5>
            <div
              className="card mt-4 mb-4"
              data-aos="fade-up"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom right, #659db5, #a5b9c2)",
              }}
            >
              <div className="card-body text-white">
                <dl className="row">
                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.username")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {patient.username}
                  </dd>

                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.email")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {patient.email}
                  </dd>

                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.phone")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {patient.phone}
                  </dd>

                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.gender")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {patient.gender}
                  </dd>

                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.dob")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {patient.dob
                      ? new Date(patient.dob).toLocaleDateString(
                          "en-US",
                          options
                        )
                      : ""}
                  </dd>

                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.insurance")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {patient.insurance || "N/A"}
                  </dd>

                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.height")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {patient.height || "N/A"}
                  </dd>

                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.weight")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {patient.weight || "N/A"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ) : (
          <p>No patient data available.</p>
        )}
      </div>
    </>
  );
};

export default PatientDetails;
