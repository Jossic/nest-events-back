import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { ListEvents } from './inputs/list.events';
import { User } from '../auth/user.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('EventsController', () => {
  let eventsController: EventsController;
  let eventsService: EventsService;
  let eventsRepository: Repository<Event>;

  beforeEach(() => {
    eventsService = new EventsService(eventsRepository);
    eventsController = new EventsController(eventsService);
  });

  it('should return a list of events', async () => {
    const result = {
      first: 1,
      last: 1,
      limit: 10,
      data: [],
    };

    // eventsService.getEventsWithAttendeeCountFilteredPaginated = jest
    //   .fn()
    //   .mockImplementation((): any => result);

    const spy = jest
      .spyOn(eventsService, 'getEventsWithAttendeeCountFilteredPaginated')
      .mockImplementation((): any => result);

    expect(await eventsController.findAll(new ListEvents())).toEqual(result);
    expect(spy).toBeCalledTimes(1);
  });

  it(`should not delete an event when it's not found`, async () => {
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');
    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation((): any => undefined);

    try {
      await eventsController.remove(1, new User());
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }

    expect(deleteSpy).not.toBeCalled();
    expect(findSpy).toBeCalledTimes(1);
  });

  it('should not delete the event if userId is different to the organizerId', async () => {
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');
    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation((): any => new Event({ organizerId: 8 }));

    try {
      const user = new User();
      console.log(user);
      await eventsController.remove(8, new User());
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }

    expect(deleteSpy).not.toBeCalled();
    expect(findSpy).toBeCalledTimes(1);
  });
});
