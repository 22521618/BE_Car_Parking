import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Resident, ResidentSchema } from '../schemas/resident.schema';
import { Vehicle, VehicleSchema } from '../schemas/vehicle.schema';
import { ParkingSession, ParkingSessionSchema } from '../schemas/parking-session.schema';
import { AccessLog, AccessLogSchema } from '../schemas/access-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resident.name, schema: ResidentSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: ParkingSession.name, schema: ParkingSessionSchema },
      { name: AccessLog.name, schema: AccessLogSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
