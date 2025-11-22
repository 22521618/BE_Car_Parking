const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    residentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident',
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['car', 'motorbike'],
        required: true
    },
    brand: String,
    color: String,
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
