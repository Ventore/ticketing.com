import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderTypes } from '../../models/order';

const buildTicket = () => {
  const ticket = Ticket.build({
    title: 'Title',
    price: 10,
    ticketId: Types.ObjectId().toHexString(),
  });
  return ticket.save();
};

describe('GET /api/v1/orders', () => {
  it('Returns list of orders for particular user', async () => {
    const [ticket1, ticket2, ticket3] = await Promise.all([
      buildTicket(),
      buildTicket(),
      buildTicket(),
    ]);

    const user1 = global.signin();
    const user2 = global.signin();

    await request(app)
      .post('/api/v1/orders')
      .set('Cookie', user1)
      .send({ ticketId: ticket1.id })
      .expect(201);
    await request(app)
      .post('/api/v1/orders')
      .set('Cookie', user2)
      .send({ ticketId: ticket2.id })
      .expect(201);
    await request(app)
      .post('/api/v1/orders')
      .set('Cookie', user2)
      .send({ ticketId: ticket3.id })
      .expect(201);

    const responce = await request(app)
      .get('/api/v1/orders')
      .set('Cookie', user2)
      .send()
      .expect(200);

    expect(responce.body.length).toEqual(2);
  });
});

describe('GET /api/v1/orders/:id', () => {
  it('Gets order by id', async () => {
    const user = global.signin();
    const ticket = await buildTicket();

    const responce = await request(app)
      .post('/api/v1/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get('/api/v1/orders/' + responce.body.id)
      .set('Cookie', user)
      .send()
      .expect(200);
  });
});
