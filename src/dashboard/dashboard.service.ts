import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resident, ResidentDocument } from '../schemas/resident.schema';
import { Vehicle, VehicleDocument } from '../schemas/vehicle.schema';
import { ParkingSession, ParkingSessionDocument } from '../schemas/parking-session.schema';
import { AccessLog, AccessLogDocument } from '../schemas/access-log.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Resident.name) private residentModel: Model<ResidentDocument>,
        @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
        @InjectModel(ParkingSession.name) private parkingSessionModel: Model<ParkingSessionDocument>,
        @InjectModel(AccessLog.name) private accessLogModel: Model<AccessLogDocument>,
    ) { }

    async getSummary() {
        const totalResidents = await this.residentModel.countDocuments();
        const totalVehicles = await this.vehicleModel.countDocuments();
        const activeSessions = await this.parkingSessionModel.countDocuments({ status: 'in_parking' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayEntries = await this.parkingSessionModel.countDocuments({
            entryTime: { $gte: today }
        });

        const todayExits = await this.parkingSessionModel.countDocuments({
            exitTime: { $gte: today }
        });

        return {
            totalResidents,
            totalVehicles,
            activeSessions,
            todayStats: {
                entries: todayEntries,
                exits: todayExits
            }
        };
    }
}
