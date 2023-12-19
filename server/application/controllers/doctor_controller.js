const Doctor = require('../models/doctor.js');
const DoctorService = require('../services/doctor_service.js');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // Adjust as per your configuration

//     const uploadImage = async (req, res) => {
//     try {
//       const imageUrl = await DoctorService.storeImage(req.file);
//       res.json({ message: "Image uploaded successfully", url: imageUrl });
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       res.status(500).send('Image upload failed');
//     }
//   }

//   const uploadImageMiddleware = upload.single('file');

const get = async (request, response) => {
    try {
        const id = request.params.id;
        const doctorDetails = await DoctorService.getDoctorDetailsWithReviews(id);
        response.status(200).json(doctorDetails);
    }
    catch (error) {
        console.error(error.message);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const getProfile = async (request, response) => {
    try {
        console.log('recieved profile request');
        const doctorDetails = await DoctorService.getDoctorProfile(request.session.username);
        response.status(200).json(doctorDetails);
    }
    catch (error) {
        console.error(error.message);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const search = async (request, response) => {
    try {
        const searchCriteria = request.body; // Assuming the criteria are sent in the request body
        const doctorResults = await DoctorService.searchDoctors(searchCriteria);
        response.status(200).json(doctorResults);
    }
    catch (error) {
        console.error(error.message);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const fetchall = async (req, res) => {
    try {
        const result = await DoctorService.allDoctors();
        res.status(200).json({ result });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
}


const create = async (req, res) => {
    try {
        // First, handle the image upload
        const doctorData = JSON.parse(req.body.data);
        const count = await Doctor.countDocuments();
        if (req.file) {
            const imageUrl = await DoctorService.storeImage(req.file);
            doctorData.profilePicture = imageUrl;
            doctorData.id = count + 1;
        }

        // Now, create the doctor record with the updated doctorData
        const newDoctor = await DoctorService.createDoctor(doctorData);

        res.status(201).json(newDoctor);
    } catch (error) {
        console.error('Error in creating doctor:', error.message);
        res.status(500).json({ error: error.message });
    }
}


const getSlots = async (req, res) => {
    try {
        const doctorId = req.params.Id; // Use 'Id' to match the route parameter
        const date = req.query.date; // Date as a query parameter
        const slotDetails = await DoctorService.getSlotDetailsForDay(doctorId, new Date(date));
        res.status(200).json(slotDetails);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

async function getDoctorByIdController(req, res) {
    try {
        const doctorId = req.params.Id; // Get the doctor ID from request parameters
        const doctor = await DoctorService.getDoctorById(doctorId);

        if (!doctor) {
            return res.status(404).send('Doctor not found');
        }

        res.json(doctor);
    } catch (error) {
        console.error('Error in getDoctorByIdController:', error);
        res.status(500).send(error.message);
    }
}


module.exports = {
    get,
    search,
    create,
    fetchall,
    getSlots,
    getProfile,
    getDoctorByIdController,
    uploadImage: (req, res, next) => uploadImageMiddleware(req, res, () => uploadImage(req, res, next))
};