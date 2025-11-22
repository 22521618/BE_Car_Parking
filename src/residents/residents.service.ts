import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resident, ResidentDocument } from '../schemas/resident.schema';

@Injectable()
export class ResidentsService {
  constructor(@InjectModel(Resident.name) private residentModel: Model<ResidentDocument>) { }

  async create(createResidentDto: any) {
    return await this.residentModel.create(createResidentDto);
  }

  async findAll(query: any) {
    return await this.residentModel.find(query).exec();
  }

  async findOne(id: string) {
    return await this.residentModel.findById(id).exec();
  }

  async update(id: string, updateResidentDto: any) {
    return await this.residentModel.findByIdAndUpdate(id, updateResidentDto, { new: true }).exec();
  }

  async remove(id: string) {
    return await this.residentModel.findByIdAndDelete(id).exec();
  }
}
