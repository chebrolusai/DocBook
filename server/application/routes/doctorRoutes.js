const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/doctor_controller.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Adjust this as needed

router.route('/alldoc')
    .get(DoctorController.fetchall);
router.route('/upload-image')
    .post(DoctorController.uploadImage);
router.route('/profile')
    .get(DoctorController.getProfile);
router.route('/search')
    .post(DoctorController.search);
router.route('/create')
    .post(upload.single('profilePicture'), DoctorController.create);
router.route('/slot/:Id/slots')
    .get(DoctorController.getSlots);
router.route('/:id')
    .get(DoctorController.get);
router.route('/get-availability/:Id')
    .get(DoctorController.getDoctorByIdController);

module.exports = router;
