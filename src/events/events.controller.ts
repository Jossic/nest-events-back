import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  // Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { CreateEventDto } from './inputs/create-event.dto';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { UpdateEventDto } from './inputs/update-event.dto';
import { ListEvents } from './inputs/list.events';

@Controller('/events')
export class EventsController {
  // readonly #logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    return await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
      filter,
      {
        total: true,
        currentPage: filter.page,
        limit: 10,
      },
    );
  }

  @Get('/practice')
  async Practice() {
    return await this.eventRepository.find({ where: { id: MoreThan(2) } });
  }

  @Get('/practice2')
  async Practice2() {
    // const event = await this.eventRepository.findOne({
    //   where: { id: 1 },
    //   relations: { attendees: true },
    // });
    // if (!event) {
    //   throw new NotFoundException();
    // }
    // const attendee = new Attendee();
    // attendee.name = 'Jerry';
    // attendee.event = event;
    // await this.attendeeRepository.save({ ...attendee });

    // With Cascade - set cascade to true in oneToMany relation to event entity
    // const attendee = new Attendee();
    // attendee.name = 'Jerry with cascade';
    // event.attendees.push(attendee);
    // await this.eventRepository.save({ ...event });

    return await this.eventRepository
      .createQueryBuilder('e')
      .select(['e.id', 'e.name'])
      .orderBy('e.id', 'ASC')
      .take(3)
      .getMany();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // const event = await this.eventRepository.findOne({
    //   where: { id },
    //   relations: { attendees: true },
    // });
    const event = await this.eventsService.getEvent(id);
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
    const result = await this.eventsService.deleteEvent(id);
    if (result?.affected !== 1) throw new NotFoundException();
  }
}
