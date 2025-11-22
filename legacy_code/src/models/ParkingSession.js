const mongoose = require('mongoose');

const parkingSessionSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        required: true,
        index: true
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    residentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident',
        required: true
    },
    entryTime: {
        type: Date,
        required: true
    },
    exitTime: {
        type: Date,
        default: null
    },
    entryImage: String,
    exitImage: String,
    duration: {
        type: Number, // Minutes
        default: 0
    },
    status: {
        type: String,
        enum: ['in_parking', 'completed'],
        default: 'in_parking'
    }
}, {
    timestamps: true
});

// Indexes for faster queries
parkingSessionSchema.index({ vehicleId: 1, status: 1 });
parkingSessionSchema.index({ status: 1, exitTime: 1 });

module.exports = mongoose.model('ParkingSession', parkingSessionSchema);
