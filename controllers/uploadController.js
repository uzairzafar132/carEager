const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define the destination folder for uploads
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Define the filename format
    },
});

const upload = multer({ storage });

const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload the file to Cloudinary
    cloudinary.uploader.upload(req.file.path, { folder: 'uploads' }, (error, result) => {
        if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({ success: false, message: 'Cloudinary upload error', error });
        }

        // Return the Cloudinary URL
        return res.status(200).json({ success: true, url: result.secure_url });
    });
};

module.exports = {
    upload,
    uploadImage,
};
