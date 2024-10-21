// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadImage } = require('../controllers/uploadController');

const authController = require("../controllers/authController");
const loginRateLimiter = require('../middlewares/loginratelimiter');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use the current timestamp and original file name
    }
});

const upload = multer({ storage });

// Route to handle image upload
router.post('/upload', upload.single('file'), uploadImage);
router.post("/signup", authController.signup);
router.post('/login', loginRateLimiter, authController.login);

// router.post("/forgetpassword", authController.forgotPassword);

module.exports = router;
