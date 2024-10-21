const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  idCardFrontPicture: {
    type: String,
  },
  idCardBackPicture: {
    type: String,
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  place: {
    type: String,
  },
  permanentAddress: {  // Add this line
    type: String,
  },
});

module.exports = mongoose.model("Mechanic", userSchema);
