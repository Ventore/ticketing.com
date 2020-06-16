import { Listener, TicketCreatedEvent, Subjects } from '@ventore/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], message: Message) {
    const ticket = await Ticket.build({
      title: data.title,
      price: data.price,
      ticketId: data.id,
    });

    await ticket.save();

    message.ack();
  }
}
