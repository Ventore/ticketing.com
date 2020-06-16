import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderTypes } from '../../models/order';
import { natsService } from '../../services/nats-client';
import { Types } from 'mongoose';

describe('POST /api/v1/orders', () => {
  it('Authenticates user', async () => {
    await request(app).post('/api/v1/orders').send({}).expect(401);
    const response = await request(app)
      .post('/api/v1/orders')
      .set('Cookie', global.signin());
    expect(response.status).not.toEqual(401);
  });
  it('Validates ticket ID', async () => {
    await request(app)
      .post('/api/v1/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: '' })
      .expect(400);
    await request(app)
      .post('/api/v1/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: 'asdasdad' })
      .expect(400);
    await request(app)
      .post('/api/v1/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: Types.ObjectId() })
      .expect(404);

    const ticket = Ticket.build({
      title: 'Title',
      price: 10,
      ticketId: Types.ObjectId().toHexString(),
    });
    await ticket.save();
    const order = Order.build({
      userId: Types.ObjectId().toHexString(),
      ticket,
      status: OrderTypes.Created,
      expiresAt: new Date(),
    });
    await order.save();
    await request(app)
      .post('/api/v1/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id })
      .expect(400);
  });
  it('Create valid ticket', async () => {
    const ticket = Ticket.build({
      title: 'Title',
      price: 10,
      ticketId: Types.ObjectId().toHexString(),
    });
    await ticket.save();
    await request(app)
      .post('/api/v1/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);

    expect(natsService.client.publish).toBeCalled();
  });
});
