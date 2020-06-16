import { Listener, TicketUpdatedEvent, Subjects } from '@ventore/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(event: TicketUpdatedEvent['data'], message: Message) {
    const ticket = await Ticket.findByEvent(event);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set('title', event.title);
    ticket.set('price', event.price);

    await ticket.save();

    message.ack();
  }
}
