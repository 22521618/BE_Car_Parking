import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParkingSessionsService } from './parking-sessions.service';
import { ParkingSessionsController } from './parking-sessions.controller';
import { ParkingSession, ParkingSessionSchema } from '../schemas/parking-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ParkingSession.name, schema: ParkingSessionSchema }]),
  ],
  controllers: [ParkingSessionsController],
  providers: [ParkingSessionsService],
})
export class ParkingSessionsModule { }
