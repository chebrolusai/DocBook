import Review from "./Review";

interface DoctorDetails {
    id: number;
    username: string;
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
    reviews: Review[];
  }
  
  export default DoctorDetails;
  