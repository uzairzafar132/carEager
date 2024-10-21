// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyUser = require('../middlewares/verifyToken')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Multer configuration for temporary file storage



router.get("/profile",  verifyUser, userController.profile);
// router.get("/status",  userController.updateStatus);
router.get('/dashboard/:userId', verifyUser,userController.getUserDashboardData);
// Toggle user online status route
router.get("/needy/all", userController.needyUser);

router.delete("/offline/:userId", userController.offlineNeedyUser);
// User will try to Find Mechanic
router.post("/findMechanic/:userId", userController.findMechanic);
// router.post("/auth/signup", userController.signup);
router.post("/auth/login", userController.login);
router.post('/auth/signup', upload.array('images', 2), userController.signup);

module.exports = router;
