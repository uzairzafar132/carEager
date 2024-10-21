// preprocessController.js

const MechanicRequest = require("../model/mechanicRequest"); // Assuming you have the MechanicRequest model
const NeedyUser = require("../model/needyUsers");
const axios = require("axios");
const Mechanic = require("../model/Mechanic");
const User = require("../model/user");

const MechanicRequestToUser = async (req, res) => {
  const { needyUserId, fareAmount, mechanicId } = req.body;
  console.log("fare enter by mechanic")
  console.log(fareAmount);
  try {
    // Creating a new MechanicRequest instance
    const existingRequest = await MechanicRequest.findOneAndUpdate(
      { needyUserID: needyUserId, mechanicID: mechanicId },
      { fareAmount: fareAmount },
      { new: true } // To return the updated document
    );


    if (existingRequest) {
      // If an existing request was found and updated
      console.log("Existing request updated:", existingRequest);
      res
        .status(200)
        .json({
          message: "Existing request updated successfully",
          data: existingRequest,
        });
    } else {
      // If no existing request was found
      const mechanic = await Mechanic.findOne({ _id: mechanicId });
      const user = await User.findOne({ _id: needyUserId });
      // if (!mechanic) {
      //   return res.status(401).json({ message: "not found" });
      // }

      const newRequest = new MechanicRequest({
        needyUserID: needyUserId,
        mechanicID: mechanicId,
        fareAmount: fareAmount,
        status: "pending",
        mechanic_name: mechanic.name,
        mechanic_addr: mechanic.place,
        macLat: mechanic.lat,
        macLng: mechanic.lng,
        userLat: user.lat,
        userLng:user.lng
      });

      await newRequest.save();

      console.log("No matching request found", newRequest);
      res
        .status(200)
        .json({ message: "create new request successfully", data: newRequest });
    }

  } catch (error) {
    console.error(error);
    // Sending an error response in case of an exception
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const ToUserShowMechanic = async (req, res) => {
  const { needy } = req.body;
  console.log("ToUserShowMechanic  id:" + needy);
  try {
    // Find all requests for the given needyUserId
    const requests = await MechanicRequest.find({ needyUserID: needy, requestStatus: false });
    // console.log(requests);
    // Send the requests as a response
    res.json({ success: true, onlineMechanics: requests });
  } catch (error) {
    console.error(error);
    // Send an error response in case of an exception
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const OfferAcceptedByUser = async (req, res) => {
  const { requestId } = req.body;
  console.log("request  id: " + requestId);
  try {
    // Find the MechanicRequest by its _id and update the requestStatus to true
    const updatedRequest = await MechanicRequest.findByIdAndUpdate(
      requestId,
      { requestStatus: true },
      { new: true } // to return the updated document
    );

    // Check if the request was found and updated successfully
    if (!updatedRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, updatedRequest });
  } catch (error) {
    console.error(error);
    // Send an error response in case of an exception
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getStatus = async (req, res) => {
  const { requestId } = req.body;
  console.log(requestId + ": req id ")
  try {
    // Find all requests for the given needyUserId
    const requestData = await MechanicRequest.findOne({ _id: requestId });
    console.log(requestData);
    // Send the requests as a response
    res.json({ success: true, data: requestData });
  } catch (error) {
    console.error(error);
    // Send an error response in case of an exception
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const sendNotification = async (msg, token) => {
  data = {
    to: token,
    sound: "default",
    title: 'Title',
    body: msg,
    data: { screen: 'ReviewPage', someData: 'goes here' },
  };
  await axios.post(
    "https://exp.host/--/api/v2/push/send",
    data
  );
}

const sendNotificationToUser = async (req, res) => {
  const { requestId, amount } = req.body;
  console.log("request ID " + requestId)
  try {
    // Find the MechanicRequest by requestId
    const mechanicRequest = await MechanicRequest.findById(requestId);

    if (!mechanicRequest) {
      return res.status(404).json({ message: "Mechanic request not found" });
    }

    // Update the mecAmount and status to "completed"
    mechanicRequest.mecAmount = amount;
    mechanicRequest.status = "completed";

    // Save the updated MechanicRequest
    await mechanicRequest.save();

    // Get the needyUserID from the MechanicRequest
    const needyUserId = mechanicRequest.needyUserID;


    // Find the NeedyUser by needyUserID
    const needyUser = await NeedyUser.findOne({ user_id: needyUserId });

    if (!needyUser) {
      return res.status(404).json({ message: "Needy user not found" });
    }

    // Get the deviceToken from the NeedyUser
    const deviceToken = needyUser.deviceToken;

    console.log("Device Token:", deviceToken);
    await sendNotification("CarEager", deviceToken)

    // You can now use this deviceToken to send a notification
    // Example: Send notification logic here...

    return res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  MechanicRequestToUser,
  ToUserShowMechanic,
  OfferAcceptedByUser,
  getStatus,
  sendNotificationToUser
};
