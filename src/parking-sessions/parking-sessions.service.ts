import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParkingSession, ParkingSessionDocument } from '../schemas/parking-session.schema';

@Injectable()
export class ParkingSessionsService {
  constructor(@InjectModel(ParkingSession.name) private parkingSessionModel: Model<ParkingSessionDocument>) { }

  async findAll(query: any) {
    const { from, to, licensePlate, residentId } = query;
    const filter: any = {};

    if (from || to) {
      filter.entryTime = {};
      if (from) filter.entryTime.$gte = new Date(from);
      if (to) filter.entryTime.$lte = new Date(to);
    }
    if (licensePlate) filter.licensePlate = { $regex: licensePlate, $options: 'i' };
    if (residentId) filter.residentId = residentId;

    return await this.parkingSessionModel.find(filter)
      .populate('vehicleId')
      .populate('residentId')
      .sort({ entryTime: -1 })
      .exec();
  }

  async findOne(id: string) {
    return await this.parkingSessionModel.findById(id)
      .populate('vehicleId')
      .populate('residentId')
      .exec();
  }

  async getStats() {
    // Example stats: sessions per day for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return await this.parkingSessionModel.aggregate([
      { $match: { entryTime: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$entryTime" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }
}
