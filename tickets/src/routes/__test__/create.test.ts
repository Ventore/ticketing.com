import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsService } from '../../services/nats-client';

describe.only('POST /api/v1/tickets', () => {
  it('Authenticates user', async () => {
    await request(app).post('/api/v1/tickets').send({}).expect(401);
    const response = await request(app)
      .post('/api/v1/tickets')
      .set('Cookie', global.signin());
    expect(response.status).not.toEqual(401);
  });
  it('Validates ticket', async () => {
    await request(app)
      .post('/api/v1/tickets')
      .set('Cookie', global.signin())
      .send({ title: '', price: 10 })
      .expect(400);
    await request(app)
      .post('/api/v1/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'Ticket', price: -10 })
      .expect(400);
  });
  it('Create valid ticket', async () => {
    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);

    await request(app)
      .post('/api/v1/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'Ticket', price: 10 })
      .expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1);
    expect(natsService.client.publish).toBeCalled();
  });
});
