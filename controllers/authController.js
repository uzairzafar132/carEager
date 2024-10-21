// controllers/authController.js
const User = require("../model/Mechanic");
const DashboardData = require("../model/dashboardData")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

// Signup controller
exports.signup = async (req, res) => {
  const { name, phone, password, role, profilePicture, idCardFrontPicture, idCardBackPicture } = req.body;

  if (!name || !phone || !password || !role || !profilePicture || !idCardFrontPicture || !idCardBackPicture) {
    return res.status(400).json({ error: 'All fields are mandatory' });
  }

  // Validate name
  const nameRegex = /^[a-zA-Z]+(?:[0-9]*[a-zA-Z]*)*$/;
  // if (!nameRegex.test(name)) {
  //   return res.status(400).json({ error: 'Invalid name format' });
  // }

  // Validate phone number format (assuming a simple 10-digit format)
  const phoneRegex = /^\d{11}$/;
  // if (!phoneRegex.test(phone)) {
  //   return res.status(400).json({ error: 'Invalid phone number format' });
  // }
  // Define password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  // Validate password using regex
  //  At least one lowercase letter.
  // At least one uppercase letter.
  // At least one digit.
  // At least one special character (one of @$!%*?&).
  // if (!passwordRegex.test(password)) {
  //   return res.status(400).json({ error: 'Invalid password format' });
  // }
  console.log(name, phone, password, role, profilePicture, idCardFrontPicture, idCardBackPicture);
  try {
    // Check if user with the same phone number already exists
    const existingUser = await User.findOne({ phone });
    console.log(existingUser);
    if (existingUser) {
      return res.status(401).json({ error: 'User with this phone number already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({ name, phone, password: hashedPassword, role, profilePicture, idCardFrontPicture, idCardBackPicture });

    const newDashboardData = new DashboardData({ user: newUser._id });
    await newDashboardData.save();

    // Set the user's dashboardData reference
    newUser.dashboardData = newDashboardData._id;

    // Save the user to the database
    await newUser.save();
    const usertoken = jwt.sign({ userId: User._id, phone: User.phone }, secretKey);

    res.status(201).json({
      usertoken: usertoken,
      userId: newUser._id,
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  console.log(user);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const usertoken = jwt.sign({ userId: user._id, phone: user.phone }, secretKey);

  res.json({ usertoken, userId: user._id, username: user.name });

};

//Forget Password controller

// exports.forgotPassword = async (req, res) => {
//   const { phone } = req.body;
//   console.log(req.body)
//   if (!phone) {
//     return res.status(400).json({ error: 'Phone number is required' });
//   }
//   const phoneRegex = /^\d{11}$/;
//   if (!phoneRegex.test(phone)) {
//     return res.status(400).json({ error: 'Invalid phone number format' });
//   }
//   try {
//     // Check if the user with the provided phone number exists
//     const user = await User.findOne({ phone });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Generate a random one-time code
//     const otp = Math.floor(100000 + Math.random() * 900000);

//     // Store the generated code in the user document or a separate collection in the database
//     user.passwordResetCode = otp;
//     await user.save();

//     // Send the code to the user via SMS (using Twilio in this example)
//     await twilioClient.messages.create({
//       body: `Your password reset code is: ${otp}`,
//       to: `+${user.phone}`, // Assuming your phone numbers are stored in E.164 format
//       from: 'your_twilio_phone_number',
//     });

//     res.status(200).json({ message: 'Password reset code sent successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };





