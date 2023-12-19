import React, { useState, ChangeEvent, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DocBookHeader from "../components/DocBookHeader";

interface FormData {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  dob: string;
  weight: string;
  height: string;
  insurance: string;
}

const PatientRegistrationForm: React.FC = () => {
  if (localStorage.getItem("Type")) {
    window.location.href = "/profile";
  }

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "male",
    dob: "",
    weight: "",
    height: "",
    insurance: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    if (id === "username") {
      const isValidUsername = /^[a-zA-Z0-9]+$/.test(value);
      if (!isValidUsername) {
        setErrorMessage(
          "Invalid characters in username. Only alphanumeric characters are allowed."
        );
        return;
      }
    }

    setErrorMessage(null);

    setFormData((prevData) => ({
      ...prevData,
      [id]: id === "gender" ? e.target.value : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("clicked submit");
    try {
      const response = await fetch("/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Patient registered successfully!");
        setLoginSuccess(true);
        setTimeout(() => {
          setLoginSuccess(false);
          window.location.href = "/login";
        }, 1000);
        setError(null);
      } else {
        setErrorMessage("Error Registering Patient");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {error && (
        <div
          className="alert alert-danger alert-top"
          role="alert"
          style={{ zIndex: "1" }}
        >
          {error}
        </div>
      )}

      {loginSuccess && (
        <div
          className="alert alert-success alert-top"
          role="alert"
          style={{ zIndex: "1" }}
        >
          Login successful! Redirecting...
        </div>
      )}
      <div
        style={{ backgroundColor: "#f8fcfd", height: "100%", width: "100%" }}
      >
        <DocBookHeader></DocBookHeader>
        <div className="container mt-5 mb-5 ">
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
                  Patient Registration
                </h2>

                {/* Login Details */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <h4 style={{ color: "#495057" }}>Login Details</h4>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        onChange={handleInputChange}
                        required
                      />
                      {errorMessage && (
                        <div
                          className="alert alert-danger alert-top"
                          role="alert"
                        >
                          {errorMessage}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
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
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="mb-4">
                    <h4 style={{ color: "#495057" }}>Contact</h4>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
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
                      <label htmlFor="phone" className="form-label">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <textarea
                        className="form-control"
                        id="address"
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h4 style={{ color: "#495057" }}>Personal Information</h4>
                    <div className="mb-3">
                      <label htmlFor="gender" className="form-label">
                        Gender
                      </label>
                      <select
                        className="form-select"
                        id="gender"
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="dob" className="form-label">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="dob"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="weight" className="form-label">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="weight"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="height" className="form-label">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="height"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="insurance" className="form-label">
                        Insurance
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="insurance"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-3"
                    style={{
                      backgroundColor: "#007BFF",
                      borderColor: "#007BFF",
                    }}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientRegistrationForm;
