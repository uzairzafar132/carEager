const mongoose = require("mongoose");
const { Schema } = mongoose;

const onlineMechanicSchema = new Schema({
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
  online: {
    type: Boolean,
    default: false,
  },
  mechanic_id: {
    type: Schema.Types.ObjectId,
    ref: "Mechanic",
    required: true,
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
});

const OnlineMechanic = mongoose.model("OnlineMechanic", onlineMechanicSchema);

module.exports = OnlineMechanic;
