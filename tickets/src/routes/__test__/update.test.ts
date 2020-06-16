import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { natsService } from '../../services/nats-client';

describe('PUT /api/v1/tickets/:id', () => {
  const id = mongoose.Types.ObjectId().toHexString();
  it('Validates user', async () => {
    await request(app)
      .put('/api/v1/tickets/' + id)
      .send({})
      .expect(401);
  });
  it('Validates user input', async () => {
    await request(app)
      .put('/api/v1/tickets/' + id)
      .set('Cookie', global.signin())
      .send({ title: '', price: 10 })
      .expect(400);
    await request(app)
      .put('/api/v1/tickets/' + id)
      .set('Cookie', global.signin())
      .send({ title: 'Ticket', price: -10 })
      .expect(400);
  });
  it('Return 404 if no ticket found', async () => {
    await request(app)
      .put('/api/v1/tickets' + id)
      .send({})
      .expect(404);
  });
  it('Updates ticket', async () => {
    const cookie = global.signin();
    const ticketAttr = {
      title: 'Title',
      price: 10,
    };
    const ticket = await request(app)
      .post('/api/v1/tickets')
      .set('Cookie', cookie)
      .send(ticketAttr)
      .expect(201);

    const response = await request(app)
      .put('/api/v1/tickets/' + ticket.body.id)
      .set('Cookie', cookie)
      .send({ title: 'New title', price: 20 })
      .expect(200);

    expect(response.body.title).toEqual('New title');
    expect(natsService.client.publish).toBeCalled();
  });
});
