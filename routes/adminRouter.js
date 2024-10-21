const express = require("express");
const router = express.Router();
const mechanicController = require('../controllers/mechanicController')

router.get("/getMechanics", mechanicController.getMechanics);
router.put("/mechanicUpdate", mechanicController.updateMechanic);
module.exports = router;