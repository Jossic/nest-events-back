import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './inputs/create-event.dto';
import { EventsService } from './events.service';
import { UpdateEventDto } from './inputs/update-event.dto';
import { ListEvents } from './inputs/list.events';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';

@Controller('/events')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {
    return await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
      filter,
      {
        total: true,
        currentPage: filter.page,
        limit: 2,
      },
    );
  }

  // @Get('/practice')
  // async Practice() {
  //   return await this.eventRepository.find({ where: { id: MoreThan(2) } });
  // }

  // @Get('/practice2')
  // async Practice2() {
  //   // const event = await this.eventRepository.findOne({
  //   //   where: { id: 1 },
  //   //   relations: { attendees: true },
  //   // });
  //   // if (!event) {
  //   //   throw new NotFoundException();
  //   // }
  //   // const attendee = new Attendee();
  //   // attendee.name = 'Jerry';
  //   // attendee.event = event;
  //   // await this.attendeeRepository.save({ ...attendee });
  //
  //   // With Cascade - set cascade to true in oneToMany relation to event entity
  //   // const attendee = new Attendee();
  //   // attendee.name = 'Jerry with cascade';
  //   // event.attendees.push(attendee);
  //   // await this.eventRepository.save({ ...event });
  //
  //   return await this.eventRepository
  //     .createQueryBuilder('e')
  //     .select(['e.id', 'e.name'])
  //     .orderBy('e.id', 'ASC')
  //     .take(3)
  //     .getMany();
  // }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return await this.eventsService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.getEventWithAttendeeCount(id);
    if (!event) {
      throw new NotFoundException();
    }
    if (event.organizerId != user.id) {
      throw new ForbiddenException(null, 'You are not allowed to change this');
    }
    return await this.eventsService.updateEvent(event, input);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id, @CurrentUser() user: User) {
    const event = await this.eventsService.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }
    if (event.organizerId != user.id) {
      throw new ForbiddenException(null, 'You are not allowed to remove this');
    }
    await this.eventsService.deleteEvent(id);
  }
}
