
const express = require("express");
const router = express.Router();
const mechanicController = require("../controllers/mechanicController");
const verifyUser = require("../middlewares/verifyToken");

router.post("/online/:userId", mechanicController.updateStatus);
router.get("/online/all", mechanicController.GetonlineMechanics);
router.put("/offline/:userId", mechanicController.offlineMechanic);

router.post("/offline/:userId", mechanicController.offlineMechanic);

module.exports = router;