const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configure multer storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'mrcs',
  // allowedFormats: ['jpg', 'jpeg', 'png'],
  allowedFormats: null,
  transformation: [{ width: 500, height: 500, crop: 'limit' }],
});

// Initialize multer middleware
const upload = multer({
  storage: storage,
});

module.exports = upload.single('image');
