import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderTypes,
} from '@ventore/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  subject: ExpirationCompleteEvent['subject'] = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('No order was found');
    }
    if (order.status === OrderTypes.Complete) {
      return msg.ack();
    }

    order.set('status', OrderTypes.Cancelled);

    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      ticket: { id: order.ticket.id },
      __v: order.__v,
    });

    msg.ack();
  }
}
