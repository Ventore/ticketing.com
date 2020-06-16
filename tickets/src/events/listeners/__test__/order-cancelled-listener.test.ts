import { Ticket } from '../../../models/ticket';
import { OrderTypes } from '@ventore/common';
import { Types } from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsService } from '../../../services/nats-client';

describe('EVENT order:cancelled', () => {
  let data: any;
  let ticket: any;
  let msg: any;
  beforeEach(async () => {
    ticket = await Ticket.build({
      userId: Types.ObjectId().toHexString(),
      title: 'Title',
      price: 10,
      orderId: Types.ObjectId().toHexString(),
    }).save();

    data = {
      id: Types.ObjectId().toHexString(),
      ticket: { id: ticket.id, price: ticket.price },
      userId: Types.ObjectId().toHexString(),
      expiresAt: new Date().toISOString(),
      status: OrderTypes.Canceled,
      __v: 0,
    };

    msg = {
      ack: jest.fn(),
    };
  });

  it('Remove orderId from the ticket', async () => {
    await new OrderCancelledListener(natsService.client).onMessage(data, msg);

    const result = await Ticket.findById(ticket.id);

    expect(result!.orderId).not.toBeDefined();
  });
  it('Acks the  message', async () => {
    await new OrderCancelledListener(natsService.client).onMessage(data, msg);

    expect(msg.ack).toBeCalled();
  });
  it('Publishes ticket:updated event', async () => {
    await new OrderCancelledListener(natsService.client).onMessage(data, msg);

    expect(natsService.client.publish).toBeCalled();
  });
});
