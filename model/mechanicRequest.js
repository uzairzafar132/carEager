const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mechanicRequestsSchema = new Schema({
  mechanicID: {
    type: Schema.Types.ObjectId,
    ref: "OnlineMechanic", // Reference to the OnlineMechanic collection
    required: true,
  },

  needyUserID: {
    type: Schema.Types.ObjectId,
    ref: "NeedyUser", // Reference to the NeedyUser collection
    required: true,
  },
  mechanic_name: {
    type: String,
    required: true,
  },
  mechanic_addr: {
    type: String,
    required: true,
  },
  macLat: {
    type: Number,
  },
  macLng: {
    type: Number,
  },
  userLat: {
    type: Number,
  },
  userLng: {
    type: Number,
  },
  fareAmount: {
    type: Number,
    required: true,
  },
  mecAmount:{
    type: Number,

  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected","completed"],
    default: "pending",
  },
  requestStatus: {
    type: Boolean,
    default: false,
  },
});

const MechanicRequest = mongoose.model(
  "MechanicRequest",
  mechanicRequestsSchema
);

module.exports = MechanicRequest;
