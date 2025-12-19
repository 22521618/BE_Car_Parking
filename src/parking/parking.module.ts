import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { Resident, ResidentSchema } from '../schemas/resident.schema';
import { Vehicle, VehicleSchema } from '../schemas/vehicle.schema';
import { ParkingSession, ParkingSessionSchema } from '../schemas/parking-session.schema';
import { AccessLog, AccessLogSchema } from '../schemas/access-log.schema';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resident.name, schema: ResidentSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: ParkingSession.name, schema: ParkingSessionSchema },
      { name: AccessLog.name, schema: AccessLogSchema },
    ]),
    EventsModule,
    ClientsModule.registerAsync([
      {
        name: 'MQTT_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.MQTT,
          options: {
            url: configService.get('MQTT_BROKER_URL'),
            username: configService.get('MQTT_USERNAME'),
            password: configService.get('MQTT_PASSWORD'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule { }
