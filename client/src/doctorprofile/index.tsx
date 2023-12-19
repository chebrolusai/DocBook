import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DoctorDetails from "../interfaces/Doctor";
import DoctorInfoSection from "../components/DoctorInfoSection";
import DoctorProfileSection from "../components/DoctorProfileSection";
import ReviewSection from "../components/Reviews";
import GoogleLocation from "../components/GoogleLocation";
import Accordion from "../components/Accordion";
import Footer from "../components/Footer";

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(
    null
  );

  useEffect(() => {
    fetch(`/doctor/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDoctorDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching doctor details:", error);
      });
  }, [id]);

  if (!doctorDetails) {
    return (
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <>
    <div>
      <DoctorProfileSection doctor={doctorDetails}></DoctorProfileSection>
      <DoctorInfoSection doctor={doctorDetails}></DoctorInfoSection>
      <ReviewSection doctorReviews={doctorDetails.reviews}></ReviewSection>
      <GoogleLocation doctorLocation={doctorDetails}></GoogleLocation>
      <div className="marginSide">
        <Accordion faqs={faqs}></Accordion>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

const faqs = [
  {
    question: "How do I book an appointment with the doctor ?",
    answer:
      "It’s easy! Just go to the homepage and type in your visit reason or the type of doctor you’d like to see. You can answer a few questions or filter by location, insurance or specialty to be guided through your options. We’ll show you a list of qualified healthcare providers who may meet your needs — you can even view their real-time availability, qualifications, office photographs, and read verified reviews from other patients. Just click on the appointment time you’d like and follow the quick prompts to book your appointment instantly.",
  },
  {
    question: "How much will my doctor’s appointment cost?",
    answer:
      "Booking appointments with DocBook is 100 percent free for patients. Please note that our services are completely separate from any costs you may have associated with visiting the doctor, such as insurance copays. If you’re not sure how much a visit will cost, check with your healthcare provider or your insurance company.",
  },
  {
    question: "How do I cancel or reschedule my appointment?",
    answer:
      "Although it is not recommended to cancel or reschedule your appointment after you receive confirmation from the doctor, DocBook allows you to reschedule or cancel your appointment free of cost.",
  },
  {
    question: "What languages does the doctor speak?",
    answer: "The doctor speaks English.",
  },
];

export default DoctorProfile;
