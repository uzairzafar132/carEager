const mongoose = require("mongoose");
const { Schema } = mongoose;

const needyUserSchema = new Schema({
  profileUrl: {
    type: String,
    // required: true,
  },
  currentLocation: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
  },
  offeringAmount: {
    type: Number,
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
  queryType: {
    type: String,
  },
  deviceToken:{
    type: String,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const NeedyUser = mongoose.model("NeedyUser", needyUserSchema);

module.exports = NeedyUser;
