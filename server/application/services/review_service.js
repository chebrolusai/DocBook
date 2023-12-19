const Review = require('../models/review');
const Doctor = require('../models/doctor');

const createReview = async (reviewData) => {
    const review = new Review(reviewData);
    const savedReview = await review.save();
    await updateDoctorRating(savedReview.doctorId);

    return savedReview;
};

const updateDoctorRating = async (doctorId) => {
    try {
        const reviews = await Review.find({ doctorId });

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        const roundedRating = Number(averageRating.toFixed(2));

        await Doctor.updateOne({ id: doctorId }, { $set: { rating: roundedRating } });
        console.log(`Doctor ${doctorId} rating updated to ${roundedRating}`);

    } catch (error) {
        console.error(`Error updating doctor rating: ${error.message}`);
    }
};


module.exports = {
    createReview,
};
