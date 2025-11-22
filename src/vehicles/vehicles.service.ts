import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from '../schemas/vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>) { }

  async create(createVehicleDto: any) {
    return await this.vehicleModel.create(createVehicleDto);
  }

  async findAll(query: any) {
    return await this.vehicleModel.find(query).populate('residentId').exec();
  }

  async findOne(id: string) {
    return await this.vehicleModel.findById(id).populate('residentId').exec();
  }

  async update(id: string, updateVehicleDto: any) {
    return await this.vehicleModel.findByIdAndUpdate(id, updateVehicleDto, { new: true }).exec();
  }

  async remove(id: string) {
    return await this.vehicleModel.findByIdAndDelete(id).exec();
  }
}
