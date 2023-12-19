const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review_controller');

router.post('/', reviewController.createReview);

module.exports = router;