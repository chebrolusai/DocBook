const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const registerRouter = require('./routes/index.js');
const session        = require('express-session');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const path = require('path');

const initialize = ( application ) => {

    application.use(cors());
    application.use(express.json());
    application.use(express.urlencoded());
    application.use(express.static(path.join(__dirname ,'..','public')));
    
    application.use(session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: true,
    }));

    const cloudinaryConfig = {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
      };

    const cloudinary = require('cloudinary').v2;
    
    cloudinary.config(cloudinaryConfig);

    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
          folder: 'uploads', 
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], 
        }
      });

    mongoose.connect(process.env.MONGO_CONNECTION);
    registerRouter(application);
};

module.exports = initialize;