import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessLog, AccessLogDocument } from '../schemas/access-log.schema';

@Injectable()
export class AccessLogsService {
  constructor(@InjectModel(AccessLog.name) private accessLogModel: Model<AccessLogDocument>) { }

  async findAll(query: any) {
    const { from, to, licensePlate, raspberryPiId, isAuthorized } = query;
    const filter: any = {};

    if (from || to) {
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = new Date(from);
      if (to) filter.timestamp.$lte = new Date(to);
    }
    if (licensePlate) filter.licensePlate = { $regex: licensePlate, $options: 'i' };
    if (raspberryPiId) filter.raspberryPiId = raspberryPiId;
    if (isAuthorized !== undefined) filter.isAuthorized = isAuthorized === 'true';

    return await this.accessLogModel.find(filter)
      .sort({ timestamp: -1 })
      .exec();
  }

  async findOne(id: string) {
    return await this.accessLogModel.findById(id).exec();
  }

  async getStats() {
    // Stats: Authorized vs Unauthorized count
    const stats = await this.accessLogModel.aggregate([
      {
        $group: {
          _id: "$isAuthorized",
          count: { $sum: 1 }
        }
      }
    ]);
    return stats;
  }
}
