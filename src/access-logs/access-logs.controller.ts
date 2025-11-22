import { Controller, Get, Param, Query } from '@nestjs/common';
import { AccessLogsService } from './access-logs.service';

@Controller('access-logs')
export class AccessLogsController {
  constructor(private readonly accessLogsService: AccessLogsService) { }

  @Get()
  findAll(@Query() query: any) {
    return this.accessLogsService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.accessLogsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessLogsService.findOne(id);
  }
}
