import { TicketCreatedListener } from '../ticket-created-listener';
import { natsService } from '../../../services/nats-client';
import { TicketCreatedEvent } from '@ventore/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

describe('EVENT ticket:created', () => {
  let data: TicketCreatedEvent['data'];
  let msg: Message;
  let listener: TicketCreatedListener;

  beforeEach(async () => {
    data = {
      id: Types.ObjectId().toHexString(),
      userId: Types.ObjectId().toHexString(),
      title: 'Title',
      price: 10,
      __v: 0,
    };

    // @ts-ignorets
    msg = {
      ack: jest.fn(),
    };

    listener = new TicketCreatedListener(natsService.client);
  });
  it('Creates and saves a ticket', async () => {
    await listener.onMessage(data, msg);

    const ticket = await Ticket.findByEvent(data);

    expect(ticket).toBeDefined();
  });
  it('Acks a message', async () => {
    await listener.onMessage(data, msg);

    expect(msg.ack).toBeCalled();
  });
});
