import { Event } from './event.entity';

it('should be initializes through constructor', () => {
  const event = new Event({ name: 'Test', description: 'Test' });
  expect(event).toEqual({ name: 'Test', description: 'Test' });
});
