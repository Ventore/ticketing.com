import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsService } from '../../../services/nats-client';
import { TicketUpdatedEvent } from '@ventore/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket, TicketDocument } from '../../../models/ticket';

describe('EVENT ticket:created', () => {
  let data: TicketUpdatedEvent['data'];
  let msg: Message;
  let listener: TicketUpdatedListener;
  let ticket: TicketDocument;

  beforeEach(async () => {
    data = {
      id: Types.ObjectId().toHexString(),
      userId: Types.ObjectId().toHexString(),
      title: 'Title',
      price: 20,
      __v: 1,
    };

    // @ts-ignorets
    msg = {
      ack: jest.fn(),
    };

    ticket = Ticket.build({
      title: 'Title',
      price: 10,
      ticketId: data.id,
    });
    await ticket.save();

    listener = new TicketUpdatedListener(natsService.client);
  });
  it('Updates and saves a ticket', async () => {
    await listener.onMessage(data, msg);

    const ticket = await Ticket.findByEvent(data);

    expect(ticket).toBeDefined();
  });
  it('Acks a message', async () => {
    await listener.onMessage(data, msg);

    expect(msg.ack).toBeCalled();
  });
  it('Checks an event order', async () => {
    data.__v = 3;

    try {
      await listener.onMessage(data, msg);
    } catch {}

    expect(msg.ack).not.toBeCalled();
  });
});
