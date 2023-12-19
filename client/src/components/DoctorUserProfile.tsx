import Doctor from "../interfaces/Doctor";
import Review from "../interfaces/Review";
import ImageAndText from "../components/ImageAndText";
import HelloImg from "../media/TaeAugust07 Large.jpeg";
import StarRating from "./StarRating";
import ReviewSection from "./Reviews";
import DoctorInfoSection from "./DoctorInfoSection";
import Appointment from "../interfaces/Appointment";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/login_slice";
import { RootState } from "../store";
import { useTranslation } from "react-i18next";
import DoctorCard from "./DoctorCard";

interface DoctorDetailsProps {
  doctor: Doctor | null;
}

const DoctorUserProfile: React.FC<DoctorDetailsProps> = ({ doctor }) => {
  const { t, i18n, ready } = useTranslation("common", { useSuspense: false });
  const [reviews, setReviews] = useState<Review[]>([] as Review[]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (doctor?.id) {
          const response = await fetch(`/appts/${doctor.id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch appointments");
          }

          const data: Appointment[] = await response.json();
          setAppointments(data);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [doctor?.id]);

  useEffect(() => {
    if (doctor?.id !== undefined && !loadingReviews) {
      setLoadingReviews(true);
      fetch(`/doctor/${doctor.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setReviews(data.reviews);
        })
        .catch((error) => {
          console.error("Error fetching doctor details:", error);
        })
        .finally(() => {
          setLoadingReviews(false);
        });
    }
  }, [doctor?.id]);

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

  const getScheduledAppointments = () => {
    const scheduledAppointments = appointments
      .filter(
        (appointment) =>
          new Date(appointment.startTime) > new Date() &&
          getStatus(
            new Date(appointment.startTime).toLocaleString("en-US", options),
            new Date(appointment.endTime).toLocaleString("en-US", options)
          ) === "Scheduled"
      )
      .map((appointment, index) => (
        <tr key={index}>
          <td>{appointment.name}</td>
          <td style={{ fontSize: "1.1em" }}>{appointment.email}</td>
          <td style={{ fontSize: "1.1em" }}>{appointment.condition}</td>
          <td style={{ fontSize: "1.1em" }}>
            {new Date(appointment.startTime).toLocaleString("en-US", options)}
          </td>
          <td style={{ fontSize: "1.1em" }}>
            {new Date(appointment.endTime).toLocaleString("en-US", options)}
          </td>
          <td style={{ fontSize: "1.1em" }}>{appointment.insuranceProvider}</td>
        </tr>
      ));
    return scheduledAppointments.length ? (
      scheduledAppointments
    ) : (
      <tr>
        <td colSpan={7}>None at the moment.</td>
      </tr>
    );
  };

  const getPastAppointments = () => {
    const pastAppointments = appointments
      .filter(
        (appointment) =>
          new Date(appointment.endTime) < new Date() ||
          getStatus(
            new Date(appointment.startTime).toLocaleString("en-US", options),
            new Date(appointment.endTime).toLocaleString("en-US", options)
          ) === "Completed"
      )
      .map((appointment, index) => (
        <tr key={index}>
          <td>{appointment.name}</td>
          <td style={{ fontSize: "1.1em" }}>{appointment.email}</td>
          <td style={{ fontSize: "1.1em" }}>{appointment.condition}</td>
          <td style={{ fontSize: "1.1em" }}>
            {new Date(appointment.startTime).toLocaleString("en-US", options)}
          </td>
          <td style={{ fontSize: "1.1em" }}>
            {new Date(appointment.endTime).toLocaleString("en-US", options)}
          </td>
          <td style={{ fontSize: "1.1em" }}>{appointment.insuranceProvider}</td>
        </tr>
      ));

    return pastAppointments.length ? (
      pastAppointments
    ) : (
      <tr>
        <td colSpan={7}>None at the moment.</td>
      </tr>
    );
  };

  return (
    <>
      <ImageAndText
        imagePath={HelloImg}
        text={`${t("profile.page.hi")}, ${doctor?.name}`}
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
        {doctor ? (
          <div>
            <h5 className="mb-4" style={{ fontSize: "2.5rem" }}>
              {t("profile.page.yourdetails")}
              <button
                type="button"
                className="btn btn-outline-primary m-4"
                //onClick={handleShowModal}
              >
                {t("profile.page.editprofile")}
              </button>
            </h5>
            <div
              className="card mt-4 mb-4"
              data-aos="fade-up"
              style={{
                backgroundImage: "linear-gradient(to right, #ffafbd, #ffc3a0)",
              }}
            >
              <div className="card-body">
                <dl className="row">
                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.username")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {doctor.username}
                  </dd>

                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.email")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {doctor.email}
                  </dd>

                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.specialty")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {doctor.specialty}
                  </dd>

                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.address")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {doctor.address}
                  </dd>

                  <dt className="col-sm-3" style={{ fontSize: "1.3rem" }}>
                    {t("profile.page.about")}
                  </dt>
                  <dd className="col-sm-9" style={{ fontSize: "1.3rem" }}>
                    {doctor.about}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="container mt-5" data-aos="fade-up">
              <div className="row mb-4">
                <div className="col">
                  <h2>{t("profile.page.education")}</h2>
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
                  <h2>{t("profile.page.experience")}</h2>
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
            <div className="container mt-5" data-aos="fade-up">
              <div className="row mb-4">
                <div className="col">
                  <h2>{t("profile.page.displaycard")}</h2>
                  <a
                    href={`/doctorprofile/doctor/${doctor.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <DoctorCard doctor={doctor}></DoctorCard>
                  </a>
                </div>
              </div>
            </div>
            <h5 className="mb-4 mt-5" style={{ fontSize: "2.5rem" }}>
              {t("profile.page.rating")}
            </h5>
            <div className="text-center d-flex align-items-center justify-content-center">
              {doctor && (
                <>
                  <span
                    className="display-1 font-weight-bold"
                    style={{ scale: "1.5", fontWeight: "500" }}
                  >
                    {doctor.rating}
                  </span>
                  <span style={{ marginLeft: "80px", scale: "4" }}>
                    <StarRating numStars={1} />
                  </span>
                  <ReviewSection doctorReviews={reviews}></ReviewSection>
                </>
              )}
            </div>
            <div>
              <h5 className="mb-4 mt-5" style={{ fontSize: "2.5rem" }}>
                {t("profile.page.upcomingappointments")}
              </h5>
              <table className="table">
                <thead>
                  <tr className="table-dark">
                    <th scope="col">{t("profile.page.patientname")}</th>
                    <th scope="col">{t("profile.page.email")}</th>
                    <th scope="col">{t("profile.page.condition")}</th>
                    <th scope="col">{t("profile.page.starttime")}</th>
                    <th scope="col">{t("profile.page.endtime")}</th>
                    <th scope="col">{t("profile.page.insurance")}</th>
                  </tr>
                </thead>
                <tbody>{getScheduledAppointments()}</tbody>
              </table>

              <h5 className="mb-4 mt-5" style={{ fontSize: "2.5rem" }}>
                {t("profile.page.pastappointments")}
              </h5>
              <table className="table">
                <thead>
                  <tr className="table-dark">
                    <th scope="col">{t("profile.page.patientname")}</th>
                    <th scope="col">{t("profile.page.email")}</th>
                    <th scope="col">{t("profile.page.condition")}</th>
                    <th scope="col">{t("profile.page.starttime")}</th>
                    <th scope="col">{t("profile.page.endtime")}</th>
                    <th scope="col">{t("profile.page.insurance")}</th>
                  </tr>
                </thead>
                <tbody>{getPastAppointments()}</tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>No Doctor data available.</p>
        )}
      </div>
    </>
  );
};

export default DoctorUserProfile;
