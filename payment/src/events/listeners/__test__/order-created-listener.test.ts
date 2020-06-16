import { OrderTypes } from '@ventore/common';
import { Types } from 'mongoose';
import { OrderCreatedListener } from '../order-created-listener';
import { natsService } from '../../../services/nats-client';
import { Order } from '../../../models/order';

describe('EVENT order:created', () => {
  let data: any;
  let msg: any;
  beforeEach(async () => {
    data = {
      id: Types.ObjectId().toHexString(),
      ticket: { id: Types.ObjectId().toHexString(), price: 10 },
      userId: Types.ObjectId().toHexString(),
      expiresAt: new Date().toISOString(),
      status: OrderTypes.Created,
      __v: 0,
    };

    msg = {
      ack: jest.fn(),
    };
  });
  it('Replicates the order', async () => {
    await new OrderCreatedListener(natsService.client).onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order).toBeDefined();
  });
  it('Acks the message', async () => {
    await new OrderCreatedListener(natsService.client).onMessage(data, msg);

    expect(msg.ack).toBeCalled();
  });
});
