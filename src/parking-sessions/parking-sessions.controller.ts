import { Controller, Get, Param, Query } from '@nestjs/common';
import { ParkingSessionsService } from './parking-sessions.service';

@Controller('parking-sessions')
export class ParkingSessionsController {
  constructor(private readonly parkingSessionsService: ParkingSessionsService) { }

  @Get()
  findAll(@Query() query: any) {
    return this.parkingSessionsService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.parkingSessionsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkingSessionsService.findOne(id);
  }
}
