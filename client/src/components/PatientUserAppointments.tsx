import React, { useState, useEffect } from "react";
import Appointment from "../interfaces/Appointment";
import DoctorDetails from "../interfaces/Doctor";
import { fetchDoctorDetails } from "../api";
import { useTranslation } from "react-i18next";

function PatientAppointments() {
  const { t, i18n, ready } = useTranslation("common", { useSuspense: false });
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [editedReview, seteditedReview] = useState({
    comment: "",
    rating: "5",
    doctorId: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };
  const handleShowModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    seteditedReview({
      comment: "",
      rating: "5",
      doctorId: appointment.doctorId,
    });
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const handleShowCancelModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
    document.body.style.overflow = "hidden";
  };
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    document.body.style.overflow = "auto";
  };
  const cancelAppointment = async () => {
    try {
      const deleteResponse = await fetch("/appts/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: selectedAppointment?._id,
        }),
      });

      if (!deleteResponse.ok) {
        throw new Error("Failed to patch the appointment");
      }

      console.log("Appointment deleted successfully");

      handleCloseCancelModal();
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    seteditedReview({
      ...editedReview,
      comment: event.target.value,
    });
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    seteditedReview({
      ...editedReview,
      rating: event.target.value,
    });
  };

  const submitReview = async () => {
    try {
      const response = await fetch("/review/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: editedReview.comment,
          rating: editedReview.rating,
          doctorId: editedReview.doctorId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const patchResponse = await fetch("/appts/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewed: true,
          _id: selectedAppointment?._id,
        }),
      });

      if (!patchResponse.ok) {
        throw new Error("Failed to patch the appointment");
      }

      console.log("Appointment patched successfully");

      console.log("Review submitted successfully");
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/appts/");
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data: Appointment[] = await response.json();
      setAppointments(data);
      console.log(data);

      const updatedAppointments = await Promise.all(
        data.map(async (appointment) => {
          try {
            const doctorDetails = await fetchDoctorDetails(
              appointment.doctorId
            );
            return {
              ...appointment,
              doctorName: doctorDetails.name,
              doctorSpecialty: doctorDetails.specialty,
            };
          } catch (error) {
            console.error(
              `Error fetching doctor details for appointment ${appointment.doctorId}:`,
              error
            );
            return appointment;
          }
        })
      );

      setAppointments(updatedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
    };

    return new Date(dateString).toLocaleString("en-US", options);
  };

  useEffect(() => {
    const AOS = require("aos");
    AOS.init({
      duration: 800,
      offset: 200,
      easing: "ease-in-out",
      once: "true",
    });
    return () => {
      AOS.refresh();
    };
  }, []);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "America/New_York",
  };
  const getStatus = (startTime: string, endTime: string): string => {
    const currentDateTime = new Date();
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    if (currentDateTime < startDateTime) {
      return "Scheduled";
    } else if (
      currentDateTime >= startDateTime &&
      currentDateTime <= endDateTime
    ) {
      return "In Progress";
    } else {
      return "Completed";
    }
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
                Write Review
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
                  <label htmlFor="review" className="form-label">
                    Review
                  </label>
                  <textarea
                    className="form-control"
                    id="review"
                    rows={3}
                    value={editedReview.comment}
                    onChange={handleCommentChange}
                  />
                </div>
                <div className="mb-3 text-start fs-5">
                  <label htmlFor="rating" className="form-label">
                    Rating
                  </label>
                  <select
                    className="form-select"
                    id="rating"
                    defaultValue="5"
                    value={editedReview.rating}
                    onChange={handleRatingChange}
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
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
                onClick={submitReview}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade${showCancelModal ? " show" : ""}`}
        aria-labelledby="contained-modal-title-vcenter"
        style={{
          display: showCancelModal ? "block" : "none",
          backdropFilter: "blur(3px)",
        }}
        tabIndex={-1}
        aria-hidden={!showCancelModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title" id="cancelAppt">
                Cancel Appointment
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseCancelModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Do you want to confirm your appointment cancellation?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseCancelModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={cancelAppointment}
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5 mb-5" data-aos="fade-down">
        <h1 className="mb-4">{t("profile.page.yourappointments")}</h1>
        <table className="table">
          <thead>
            <tr className="table-dark">
              <th scope="col">{t("profile.page.doctorname")}</th>
              <th scope="col">{t("profile.page.specialty")}</th>
              <th scope="col">{t("profile.page.condition")}</th>
              <th scope="col">{t("profile.page.starttime")}</th>
              <th scope="col">{t("profile.page.endtime")}</th>
              <th scope="col">{t("profile.page.status")}</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={index}>
                <td className="text-wrap">
                  <a
                    href={`/doctorprofile/doctor/${appointment.doctorId}`}
                    style={{ fontSize: "1.1em" }}
                  >
                    {appointment.doctorName}
                  </a>
                </td>
                <td style={{ fontSize: "1.1em" }}>
                  {appointment.doctorSpecialty}
                </td>
                <td style={{ fontSize: "1.1em" }}>{appointment.condition}</td>
                <td style={{ fontSize: "1.1em" }}>
                  {new Date(appointment.startTime).toLocaleString(
                    "en-US",
                    options
                  )}
                </td>
                <td style={{ fontSize: "1.1em" }}>
                  {new Date(appointment.endTime).toLocaleString(
                    "en-US",
                    options
                  )}
                </td>
                <td>
                  {getStatus(
                    new Date(appointment.startTime).toLocaleString(
                      "en-US",
                      options
                    ),
                    new Date(appointment.endTime).toLocaleString(
                      "en-US",
                      options
                    )
                  ) === "Completed" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="green"
                      className="bi bi-check"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="17"
                      fill="currentColor"
                      className="bi bi-hourglass-split"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z" />
                    </svg>
                  )}
                  {getStatus(
                    new Date(appointment.startTime).toLocaleString(
                      "en-US",
                      options
                    ),
                    new Date(appointment.endTime).toLocaleString(
                      "en-US",
                      options
                    )
                  ) === "Completed" &&
                    !appointment.reviewed && (
                      <button
                        type="button"
                        className="btn btn-outline-primary m-4"
                        onClick={() => handleShowModal(appointment)}
                        style={{ fontSize: "0.8em", padding: "0.1em 0.2em" }}
                      >
                        Give Review
                      </button>
                    )}
                  {getStatus(
                    new Date(appointment.startTime).toLocaleString(
                      "en-US",
                      options
                    ),
                    new Date(appointment.endTime).toLocaleString(
                      "en-US",
                      options
                    )
                  ) === "Completed" &&
                    appointment.reviewed && (
                      <button
                        type="button"
                        className="btn disabled btn-success m-4"
                        style={{ fontSize: "0.8em", padding: "0.1em 0.2em" }}
                      >
                        Reviewed
                      </button>
                    )}
                  {getStatus(
                    new Date(appointment.startTime).toLocaleString(
                      "en-US",
                      options
                    ),
                    new Date(appointment.endTime).toLocaleString(
                      "en-US",
                      options
                    )
                  ) === "Scheduled" && (
                    <button
                      type="button"
                      className="btn btn-danger m-4"
                      style={{ fontSize: "0.8em", padding: "0.1em 0.2em" }}
                      onClick={() => handleShowCancelModal(appointment)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PatientAppointments;
