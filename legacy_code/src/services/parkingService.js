const Vehicle = require('../models/Vehicle');
const ParkingSession = require('../models/ParkingSession');
const AccessLog = require('../models/AccessLog');

class ParkingService {
    async handleScan({ licensePlate, timestamp, action, image, raspberryPiId }) {
        try {
            const vehicle = await Vehicle.findOne({
                licensePlate: licensePlate,
                status: 'active'
            }).populate('residentId');

            if (!vehicle) {
                await this.logAccess({
                    licensePlate,
                    action,
                    timestamp,
                    image,
                    raspberryPiId,
                    isAuthorized: false,
                    responseStatus: 'denied',
                    errorMessage: 'Vehicle not registered'
                });

                return {
                    status: 'denied',
                    message: 'Xe không có trong hệ thống',
                    allowAccess: false
                };
            }

            if (action === 'entry') {
                return await this.handleEntry(vehicle, timestamp, image, raspberryPiId);
            } else if (action === 'exit') {
                return await this.handleExit(vehicle, timestamp, image, raspberryPiId);
            } else {
                return {
                    status: 'error',
                    message: 'Invalid action',
                    allowAccess: false
                };
            }

        } catch (error) {
            console.error('Error in handleScan:', error);
            return {
                status: 'error',
                message: 'Internal server error',
                allowAccess: false
            };
        }
    }

    async handleEntry(vehicle, timestamp, image, raspberryPiId) {
        const activeSession = await ParkingSession.findOne({
            vehicleId: vehicle._id,
            status: 'in_parking',
            exitTime: null
        });

        if (activeSession) {
            await this.logAccess({
                licensePlate: vehicle.licensePlate,
                action: 'entry',
                timestamp,
                image,
                raspberryPiId,
                isAuthorized: true,
                sessionId: activeSession._id,
                responseStatus: 'warning',
                errorMessage: 'Vehicle already in parking'
            });

            return {
                status: 'warning',
                message: 'Xe đang trong bãi, không thể vào lại',
                allowAccess: false
            };
        }

        const newSession = await ParkingSession.create({
            licensePlate: vehicle.licensePlate,
            vehicleId: vehicle._id,
            residentId: vehicle.residentId._id,
            entryTime: timestamp,
            entryImage: image,
            status: 'in_parking'
        });

        await this.logAccess({
            licensePlate: vehicle.licensePlate,
            action: 'entry',
            timestamp,
            image,
            raspberryPiId,
            isAuthorized: true,
            sessionId: newSession._id,
            responseStatus: 'allowed'
        });

        return {
            status: 'success',
            message: `Chào mừng ${vehicle.residentId.fullName} - ${vehicle.residentId.apartmentNumber}`,
            allowAccess: true,
            entryTime: timestamp
        };
    }

    async handleExit(vehicle, timestamp, image, raspberryPiId) {
        const activeSession = await ParkingSession.findOne({
            vehicleId: vehicle._id,
            status: 'in_parking',
            exitTime: null
        });

        if (!activeSession) {
            await this.logAccess({
                licensePlate: vehicle.licensePlate,
                action: 'exit',
                timestamp,
                image,
                raspberryPiId,
                isAuthorized: true,
                responseStatus: 'warning',
                errorMessage: 'Vehicle not in parking'
            });

            return {
                status: 'warning',
                message: 'Xe chưa vào bãi, không thể ra',
                allowAccess: false
            };
        }

        const entryTime = new Date(activeSession.entryTime);
        const exitTime = new Date(timestamp);
        const duration = Math.round((exitTime - entryTime) / (1000 * 60)); // minutes

        await ParkingSession.updateOne(
            { _id: activeSession._id },
            {
                exitTime: timestamp,
                exitImage: image,
                duration: duration,
                status: 'completed'
            }
        );

        await this.logAccess({
            licensePlate: vehicle.licensePlate,
            action: 'exit',
            timestamp,
            image,
            raspberryPiId,
            isAuthorized: true,
            sessionId: activeSession._id,
            responseStatus: 'allowed'
        });

        return {
            status: 'success',
            message: `Tạm biệt ${vehicle.residentId.fullName}`,
            allowAccess: true,
            exitTime: timestamp,
            duration: duration
        };
    }

    async logAccess(data) {
        try {
            await AccessLog.create(data);
        } catch (error) {
            console.error('Error logging access:', error);
        }
    }
}

module.exports = new ParkingService();
