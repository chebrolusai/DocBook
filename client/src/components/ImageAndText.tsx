import React, { useEffect } from "react";

interface GetInTouchProps {
  imagePath: string;
  text: string;
}

const ImageAndText: React.FC<GetInTouchProps> = ({ imagePath, text }) => {
  useEffect(() => {
    const AOS = require("aos");
    AOS.init({ duration: 800, offset: 200, easing: "ease-in-out", once: true });

    return () => {
      AOS.refresh();
    };
  }, []);

  return (
    <div
      className="container-fluid"
      style={{ minHeight: "60vh", width: "100%" }}
      data-aos="zoom-out"
    >
      <div className="row">
        <div className="col-md-6">
          <img
            src={imagePath}
            alt="Illustration"
            className="img-fluid"
            style={{ width: "90%", height: "90%" }}
          />
        </div>
        <div className="col-md-6 d-flex align-items-center">
          <div>
            <h2>{text}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAndText;
