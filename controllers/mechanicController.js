const User = require("../model/Mechanic");
const Mechanic = require("../model/Mechanic");
const OnlineMechanic = require("../model/onlineMechanics");
const MechanicRequest = require("../model/mechanicRequest");


const getMechanics = async (req, res) => {
  console.log("hit GetonlineMechanics");
  try {
    // Find all online mechanics in the OnlineMechanic schema
    const mechanics = await Mechanic.find({});
    // console.log(onlineMechanics);
    if (mechanics.length > 0) {
      return res.status(200).json({
        message: " mechanics found",
        mechanics: mechanics,
      });
    } else {
      return res.status(404).json({
        message: "No online mechanics found",
      });
    }
  } catch (error) {
    console.error("Error retrieving online mechanics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const updateMechanic = async (req, res) => {
  console.log("hit updateMechanic");

  const { mechanicId, permanentAddress } = req.body;
  console.log(mechanicId)
  try {
    // Validate input
    if (!mechanicId || !permanentAddress) {
      return res.status(400).json({ message: "Mechanic ID and permanent address are required" });
    }

    // Find the mechanic by ID
    const mechanic = await Mechanic.findById(mechanicId);

    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    // Update the permanent address
    mechanic.permanentAddress = permanentAddress;
    await mechanic.save();

    const mechanics = await Mechanic.find({});

    return res.status(200).json({ message: "Mechanic updated successfully", mechanic, mechanics });
  } catch (error) {
    console.error("Error updating mechanic:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateStatus = async (req, res) => {
  const userId = req.params.userId;
  const { location } = req.body;


  try {
    // Find the user by userId in the User schema
    const mechanic = await Mechanic.findById(userId);

    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    mechanic.lat = location.type.lat;
    mechanic.lng = location.type.lng;
    mechanic.place = location.type.place;
     console.log("mechanic");
    console.log(location);

    await mechanic.save();
    const existingOnlineMechanic = await OnlineMechanic.findOne({
      phone: mechanic.phone,
    });

    if (existingOnlineMechanic) {
      // If it exists, you might want to handle this case according to your requirements
      return res.status(200).json({
        message: "Mechanic exists",
        onlineMechanic: mechanic,
      });
    }

    const onlineMechanic = new OnlineMechanic({
      mechanic_id: mechanic._id,
      name: mechanic.name,
      phone: mechanic.phone,
      password: mechanic.password,
      role: mechanic.role,
      lat: mechanic.lat, // Update to use the individual lat field
      lng: mechanic.lng, // Update to use the individual lng field
      place: mechanic.place, // Update to use the individual place field
      online: true,
    });

    // Save the OnlineMechanic instance
    await onlineMechanic.save();

    return res.status(200).json({
      message: "Mechanic online status updated successfully",
      // onlineMechanic: savedOnlineMechanic,
    });
  } catch (error) {
    console.error("Error updating mechanic status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetonlineMechanics = async (req, res) => {
  console.log("hit GetonlineMechanics");
  try {
    // Find all online mechanics in the OnlineMechanic schema
    const onlineMechanics = await OnlineMechanic.find({});
    // console.log(onlineMechanics);
    if (onlineMechanics.length > 0) {
      return res.status(200).json({
        message: "Online mechanics found",
        onlineMechanics: onlineMechanics,
      });
    } else {
      return res.status(404).json({
        message: "No online mechanics found",
      });
    }
  } catch (error) {
    console.error("Error retrieving online mechanics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const offlineMechanic = async (req, res) => {
  const userId = req.params.userId;
  console.log("hit offlineMechanic", userId);
  try {
    // Find the online mechanic with the given userId in the OnlineMechanic schema and remove it
    const removedMechanic = await OnlineMechanic.findOneAndRemove({
      mechanic_id: userId,
    });
    const requrestedMechanicId = removedMechanic.mechanic_id
    console.log(removedMechanic.mechanic_id)
    console.log("removedMechanic")
    const request = await MechanicRequest.findOneAndRemove({ mechanicID: requrestedMechanicId});
    console.log(request)
    console.log("request")
    if(!request){
      console.log("request not found in preprocess")
    }
    if (removedMechanic) {
      return res.status(200).json({
        message: "Mechanic removed from the online status",
        removedMechanic: removedMechanic,
      });
    } else {
      return res.status(200).json({
        message: "No online mechanic found with the given userId",
      });
    }
    
  } catch (error) {
    console.error("Error removing mechanic:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getMechanics,
  updateMechanic,
  //
  updateStatus,
  GetonlineMechanics,
  offlineMechanic,
};
