import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResidentsService } from './residents.service';
import { ResidentsController } from './residents.controller';
import { Resident, ResidentSchema } from '../schemas/resident.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resident.name, schema: ResidentSchema }]),
  ],
  controllers: [ResidentsController],
  providers: [ResidentsService],
})
export class ResidentsModule { }
