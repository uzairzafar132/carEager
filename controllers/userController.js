const User = require("../model/user");
const DashboardData = require("../model/dashboardData");
const NeedyUser = require("../model/needyUsers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const MechanicRequest = require("../model/mechanicRequest");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

// Signup controller
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !password) {
    return res.status(400).json({ error: "All fields are mandatory" });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  // Validate password using regex
  //  At least one lowercase letter.
  // At least one uppercase letter.
  // At least one digit.
  // At least one special character (one of @$!%*?&).
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "Invalid password format" });
  }
  try {
    // Check if user with the same phone number already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const usertoken = jwt.sign({ userId: User._id }, secretKey);

    res.status(201).json({
      usertoken: usertoken,
      userId: newUser,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const usertoken = jwt.sign({ userId: user._id }, secretKey);

  res.json({ usertoken, userId: user._id, username: user.firstName });
  console.log(`Loged In ${usertoken}`);
};

exports.profile = async (req, res) => {
  return res.status(200).json({ message: "User Dashboard" });
};

//user dashboard data controller
exports.getUserDashboardData = async (req, res) => {
  try {
    // const userId = req.params.userId;
    const userId = req.params.userId;

    // Fetch user data and populate the dashboardData field
    // const user = await DashboardData.findById({user: userId})
    const user = await DashboardData.findOne({ user: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user dashboardData
    const dashboardData = {
      earnings: user.earnings || 0, // Use a default value if earnings is undefined
      totalRides: user.totalRides || 0,
      acceptedRides: user.acceptedRides || 0,
      ratings: user.ratings || 0,
      isOnline: user.isOnline || false,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.needyUser = async (req, res) => {
  console.log("Needy users");
  try {
    // Assuming NeedyUser.find() returns all needy users
    const allNeedyUsers = await NeedyUser.find();

    return res.status(200).json({
      message: "Needy users retrieved successfully",
      needyUsers: allNeedyUsers,
    });
  } catch (error) {
    console.error("Error retrieving needy users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.findMechanic = async (req, res) => {
  const { userId } = req.params;

  const { location } = req.body;

  console.log("loc",location);
  console.log("role", location.role);
  
  try {
    const foundUser = await User.findOne({ _id: userId });

    if (foundUser) {
      // Update the location in the User schema
      foundUser.lat = location.type.lat;
      foundUser.lng = location.type.lng;
      foundUser.place = location.type.place;

      await foundUser.save();

      // Check if the user already exists in NeedyUser
      const existingNeedyUser = await NeedyUser.findOne({
        email: foundUser.email,
      });

      if (!existingNeedyUser) {
        // If not exists, create a NeedyUser
        const needyUserData = {
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          lat: foundUser.lat, // Copy location data to NeedyUser
          lng: foundUser.lng,
          place:foundUser.place,
          queryType : location.role,
          user_id:userId,

        };

        const needyUser = new NeedyUser(needyUserData);
        await needyUser.save();
      }

      // Handle the response for moving the user to NeedyUser
      res.status(200).json({
        message: "User moved to NeedyUser successfully",
        updatedUser: foundUser,
      });
    } else {
      // Handle the response for user not found
      res.status(404).json({
        message: "User not found with the given userId",
      });
    }
  } catch (error) {
    console.error("Error finding and moving user:", error);
    // Handle the response for internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.offlineNeedyUser = async (req, res) => {
  const userId = req.params.userId;
  console.log("Making Needy user offline", userId);

  try {
    // Remove the needy user by userId
    const removedNeedyUser = await NeedyUser.findOneAndRemove({ user_id: userId });
    const request = await MechanicRequest.findOneAndRemove({ needyUserID: userId });
    if (!removedNeedyUser) {
      return res.status(404).json({
        message: "Needy user not found",
      });
    }

    return res.status(200).json({
      message: "Needy user removed successfully",
      needyUser: removedNeedyUser,
    });
  } catch (error) {
    console.error("Error removing needy user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// exports.findMechanic = async (req, res) => {
// const {userId} =req.params;
//   console.log(userId);
//   try {
//     // Assuming NeedyUser.find() returns all needy users
//     const allNeedyUsers = await User.find();

//     return res.status(200).json({
//       message: "Needy users retrieved successfully",
//       needyUsers: allNeedyUsers,
//     });
//   } catch (error) {
//     console.error("Error retrieving needy users:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
