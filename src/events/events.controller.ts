import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';

@Controller('/events')
export class EventsController {
  readonly #logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  @Get()
  async findAll() {
    return await this.eventRepository.find();
  }

  @Get('/practice')
  async Practice() {
    return await this.eventRepository.find({ where: { id: MoreThan(2) } });
  }
  @Get('/practice2')
  async Practice2() {
    const event = await this.eventRepository.findOne({
      where: { id: 1 },
      relations: { attendees: true },
    });
    if (!event) {
      throw new NotFoundException();
    }
    const attendee = new Attendee();
    attendee.name = 'Jerry';
    attendee.event = event;
    await this.attendeeRepository.save({ ...attendee });

    // With Cascade - set cascade to true in oneToMany relation to event entity
    // const attendee = new Attendee();
    // attendee.name = 'Jerry with cascade';
    // event.attendees.push(attendee);
    // await this.eventRepository.save({ ...event });

    return event;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: { attendees: true },
    });
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.eventRepository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      throw new NotFoundException();
    }
    return await this.eventRepository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      throw new NotFoundException();
    }
    await this.eventRepository.remove(event);
  }
}
