import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';

@Controller('/events')
export class EventsController {
  @Get()
  findAll() {
    return [
      { id: 1, name: 'My event' },
      { id: 2, name: 'My event 2' },
      { id: 3, name: 'My event 3' },
    ];
  }
  @Get(':id')
  findOne(@Param('id') id) {
    return { id: 1, name: 'My event' };
  }
  @Post()
  create(@Body() input: CreateEventDto) {
    return input;
  }
  @Patch(':id')
  update(@Param('id') id, @Body() input) {
    return input;
  }
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id): any {
    return id;
  }
}
