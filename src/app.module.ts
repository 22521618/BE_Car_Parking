import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParkingModule } from './parking/parking.module';
import { EventsModule } from './events/events.module';
import { ResidentsModule } from './residents/residents.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ParkingSessionsModule } from './parking-sessions/parking-sessions.module';
import { AccessLogsModule } from './access-logs/access-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    ParkingModule,
    EventsModule,
    ResidentsModule,
    VehiclesModule,
    DashboardModule,
    ParkingSessionsModule,
    AccessLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
