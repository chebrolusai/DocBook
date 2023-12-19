import React, { useEffect } from "react";
import StarRating from "./StarRating";
import Review from "../interfaces/Review";
import { useTranslation } from "react-i18next";

interface ReviewSectionProps {
  doctorReviews: Review[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ doctorReviews }) => {
  const { t, i18n, ready } = useTranslation("common", { useSuspense: false });
  useEffect(() => {
    const AOS = require("aos");
    AOS.init({ duration: 800, offset: 200, easing: "ease-in-out" });

    return () => {
      AOS.refresh();
    };
  }, []);

  return (
    <div id="reviews" className="align marginSide" data-aos="fade-up">
      <div className="container mt-5">
        <h2 className="mb-4">{t("profile.page.reviews")}</h2>

        {doctorReviews.map((review: Review, index: number) => (
          <div key={index}>
            <StarRating numStars={review.rating} />
            <p className="mt-2 mb-3">{review.comment}</p>
            <p className="small text-muted">Verified Reviewer</p>
            {index !== doctorReviews.length - 1 && <hr />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
