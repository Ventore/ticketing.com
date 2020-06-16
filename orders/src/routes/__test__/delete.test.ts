import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderTypes } from '../../models/order';
import { natsService } from '../../services/nats-client';
import { Types } from 'mongoose';

describe('DELETE /api/v1/orders/:id', () => {
  it('Sets order status of cancelled', async () => {
    const user = global.signin();
    const ticket = Ticket.build({ title: 'Title', price: 10 , ticketId: Types.ObjectId().toHexString()});
    await ticket.save();
    const { body: order } = await request(app)
      .post('/api/v1/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);
    await request(app)
      .delete('/api/v1/orders/' + order.id)
      .set('Cookie', user)
      .send({})
      .expect(204);

    const canceledOrder = await Order.findById(order.id);
    expect(canceledOrder!.status).toEqual(OrderTypes.Cancelled);
    expect(natsService.client.publish).toBeCalled();
  });
});
