
// routes.js

const express = require('express');
const router = express.Router();
const preprocessController = require('../controllers/preprocessController');

router.put("/preprocess", preprocessController.MechanicRequestToUser);
router.put("/preprocess/offeraccept", preprocessController.OfferAcceptedByUser);
router.post("/preprocess", preprocessController.ToUserShowMechanic);
router.post("/preprocess/getStatus", preprocessController.getStatus);
router.post("/process/completed/notifyUser", preprocessController.sendNotificationToUser);


module.exports = router;
