// user dashboard schema in which all the history will be stored
const mongoose = require('mongoose');

const dashboardDataSchema = new mongoose.Schema({
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    earnings:
    {
        type: Number,
        default: 0
    },
    totalRides: {
        type: Number,
        default: 0
    },
    acceptedRides:
    {
        type: Number,
        default: 0
    },
    ratings:
    {
        type: Number,
        default: 0
    },
    isOnline:
    {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('DashboardData', dashboardDataSchema);
