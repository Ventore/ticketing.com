import {
  Listener,
  PaymentCreatedEvent,
  Subjects,
  OrderTypes,
} from '@ventore/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  queueGroupName = queueGroupName;
  subject: PaymentCreatedEvent['subject'] = Subjects.PaymentCreated;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set('status', OrderTypes.Complete);

    await order.save();

    msg.ack();
  }
}
