import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('/events')
export class EventsController {
  @Get()
  findAll() {}
  @Get(':id')
  findOne(@Param() param) {
    return param;
  }
  @Post()
  create() {}
  @Patch(':id')
  update(@Param('id') id) {}
  @Delete(':id')
  remove(@Param('id') id) {}
}
