import HelpHeader from "../components/HelpHeader";
import ImageAndText from "../components/ImageAndText";
import svgHelp from "../media/Layer_9.svg";
import customerHelp from "../media/Wavy_Bus-26_Single-04 Large.jpeg";
import emailImg from "../media/Mar-Business_18.jpg";
import FaqAccordion from "../components/Accordion";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

function Help() {
  const { t, i18n, ready } = useTranslation("common", { useSuspense: false });
  return (
    <>
    <div>
      <HelpHeader></HelpHeader>
      <ImageAndText
        imagePath={svgHelp}
        text={t("help.page.text3")}
      ></ImageAndText>
      <ImageAndText
        imagePath={customerHelp}
        text={t("help.page.text4")}
      ></ImageAndText>
      <ImageAndText
        imagePath={emailImg}
        text={t("help.page.text5")}
      ></ImageAndText>
      <FaqAccordion faqs={faqs}></FaqAccordion>
    </div>
    <Footer></Footer>
    </>
  );
}

const faqs = [
  {
    question: "How does DocBook work?",
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
      'Please make every effort to uphold your confirmed appointments; ‘no shows’ and cancellations make it harder for other patients to find care. If you must cancel, please cancel as soon as you know you cannot make your appointment. See cancellation and no-show policy. Sign-in to your Zocdoc account > "appointments” > cancel or reschedule appointment.',
  },
  {
    question: "How do I contact the doctor’s office?",
    answer:
      "To contact the office prior to your appointment, log onto Zocdoc and click into your upcoming appointment to view the office’s phone number and address. The office’s contact information is also available in all appointment reminder emails.",
  },
];

export default Help;
