import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsService } from '../../../services/nats-client';
import { ExpirationCompleteEvent, OrderTypes } from '@ventore/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

describe('EVENT expiration:complete', () => {
  let data: ExpirationCompleteEvent['data'];
  let msg: Message;
  let listener: ExpirationCompleteListener;

  beforeEach(async () => {
    const ticket = Ticket.build({
      ticketId: Types.ObjectId().toHexString(),
      title: 'Title',
      price: 10,
    });
    await ticket.save();
    const order = Order.build({
      userId: Types.ObjectId().toHexString(),
      status: OrderTypes.Created,
      expiresAt: new Date(),
      ticket,
    });
    await order.save();

    data = {
      orderId: order.id,
    };

    // @ts-ignorets
    msg = {
      ack: jest.fn(),
    };

    listener = new ExpirationCompleteListener(natsService.client);
  });
  it('Creates and saves a ticket', async () => {
    await listener.onMessage(data, msg);

    const order = await Order.findById(data.orderId);

    expect(natsService.client.publish).toBeCalled();
    expect(order!.status).toEqual(OrderTypes.Cancelled);
  });
  it('Acks a message', async () => {
    await listener.onMessage(data, msg);

    expect(msg.ack).toBeCalled();
  });
});
