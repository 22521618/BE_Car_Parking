import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from '../schemas/vehicle.schema';
import { ParkingSession, ParkingSessionDocument } from '../schemas/parking-session.schema';
import { AccessLog, AccessLogDocument } from '../schemas/access-log.schema';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ParkingService {
    private readonly logger = new Logger(ParkingService.name);

    constructor(
        @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
        @InjectModel(ParkingSession.name) private parkingSessionModel: Model<ParkingSessionDocument>,
        @InjectModel(AccessLog.name) private accessLogModel: Model<AccessLogDocument>,
        private eventsGateway: EventsGateway,
    ) { }

    async handleScan(data: any) {
        const { licensePlate, timestamp, action, image, raspberryPiId } = data;

        try {
            const vehicle = await this.vehicleModel.findOne({
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

                this.eventsGateway.emitAlert({
                    type: 'unauthorized_access',
                    message: `Unauthorized access attempt by ${licensePlate}`,
                    licensePlate,
                    timestamp,
                    image
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
            this.logger.error('Error in handleScan:', error);
            return {
                status: 'error',
                message: 'Internal server error',
                allowAccess: false
            };
        }
    }

    async handleEntry(vehicle: any, timestamp: Date, image: string, raspberryPiId: string) {
        const activeSession = await this.parkingSessionModel.findOne({
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

            this.eventsGateway.emitAlert({
                type: 'warning',
                message: `Vehicle ${vehicle.licensePlate} already in parking`,
                licensePlate: vehicle.licensePlate,
                timestamp
            });

            return {
                status: 'warning',
                message: 'Xe đang trong bãi, không thể vào lại',
                allowAccess: false
            };
        }

        const newSession = await this.parkingSessionModel.create({
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

        this.eventsGateway.emitParkingUpdate({
            type: 'entry',
            licensePlate: vehicle.licensePlate,
            residentName: vehicle.residentId.fullName,
            apartmentNumber: vehicle.residentId.apartmentNumber,
            timestamp,
            image
        });

        // Update dashboard stats
        const count = await this.parkingSessionModel.countDocuments({ status: 'in_parking' });
        this.eventsGateway.emitDashboardStats({
            activeSessions: count
        });

        return {
            status: 'success',
            message: `Chào mừng ${vehicle.residentId.fullName} - ${vehicle.residentId.apartmentNumber}`,
            allowAccess: true,
            entryTime: timestamp
        };
    }

    async handleExit(vehicle: any, timestamp: Date, image: string, raspberryPiId: string) {
        const activeSession = await this.parkingSessionModel.findOne({
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

            this.eventsGateway.emitAlert({
                type: 'warning',
                message: `Vehicle ${vehicle.licensePlate} attempting exit but not in parking`,
                licensePlate: vehicle.licensePlate,
                timestamp
            });

            return {
                status: 'warning',
                message: 'Xe chưa vào bãi, không thể ra',
                allowAccess: false
            };
        }

        const entryTime = new Date(activeSession.entryTime);
        const exitTime = new Date(timestamp);
        const duration = Math.round((exitTime.getTime() - entryTime.getTime()) / (1000 * 60)); // minutes

        await this.parkingSessionModel.updateOne(
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

        this.eventsGateway.emitParkingUpdate({
            type: 'exit',
            licensePlate: vehicle.licensePlate,
            residentName: vehicle.residentId.fullName,
            timestamp,
            image,
            duration
        });

        // Update dashboard stats
        const count = await this.parkingSessionModel.countDocuments({ status: 'in_parking' });
        this.eventsGateway.emitDashboardStats({
            activeSessions: count
        });

        return {
            status: 'success',
            message: `Tạm biệt ${vehicle.residentId.fullName}`,
            allowAccess: true,
            exitTime: timestamp,
            duration: duration
        };
    }

    async logAccess(data: any) {
        try {
            await this.accessLogModel.create(data);
        } catch (error) {
            this.logger.error('Error logging access:', error);
        }
    }
}
