import { OrderTypes, OrderCancelledEvent } from '@ventore/common';
import { Types } from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsService } from '../../../services/nats-client';
import { Order } from '../../../models/order';

describe('EVENT order:cancelled', () => {
  let data: OrderCancelledEvent['data'];
  let msg: any;
  beforeEach(async () => {
    const order = Order.build({
      id: Types.ObjectId().toHexString(),
      userId: Types.ObjectId().toHexString(),
      price: 10,
      status: OrderTypes.Created,
      __v: 0,
    });

    await order.save();

    data = {
      id: order.id,
      ticket: { id: Types.ObjectId().toHexString() },
      __v: 1,
    };

    msg = {
      ack: jest.fn(),
    };
  });
  it('Updates status of the order', async () => {
    await new OrderCancelledListener(natsService.client).onMessage(data, msg);

    const order = Order.findById(data.id);

    expect(order).toBeDefined();
  });
  it('Acks the message', async () => {
    await new OrderCancelledListener(natsService.client).onMessage(data, msg);

    expect(msg.ack).toBeCalled();
  });
});
