import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResidentsService } from './residents.service';

@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) { }

  @Post()
  create(@Body() createResidentDto: any) {
    return this.residentsService.create(createResidentDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.residentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.residentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResidentDto: any) {
    return this.residentsService.update(id, updateResidentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.residentsService.remove(id);
  }
}
