const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ['entry', 'exit'],
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    raspberryPiId: String,
    image: String,
    isAuthorized: {
        type: Boolean,
        required: true
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSession'
    },
    responseStatus: {
        type: String,
        enum: ['allowed', 'denied', 'error', 'warning'],
        required: true
    },
    errorMessage: String
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

accessLogSchema.index({ timestamp: -1 });
accessLogSchema.index({ licensePlate: 1, timestamp: -1 });

module.exports = mongoose.model('AccessLog', accessLogSchema);
