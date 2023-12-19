const reviewService = require('../services/review_service');

const createReview = async (req, res) => {
    try {
        req.body.username = req.session.username;
        const review = await reviewService.createReview(req.body);
        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating appointment' });
    }
};

module.exports = {
    createReview,
};