import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderTypes,
} from '@ventore/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  queueGroupName = queueGroupName;
  subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    //TODO: extract to Order's statics
    const order = await Order.findOne({
      _id: data.id,
      __v: data.__v - 1,
    });

    if (!order) {
      throw new Error('No order was found');
    }

    order.set('status', OrderTypes.Cancelled);

    await order.save();

    msg.ack();
  }
}
