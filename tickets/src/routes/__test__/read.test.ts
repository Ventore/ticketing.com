import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

describe('GET /api/v1/tickets', () => {
  it('Returns list of tickets', async () => {
    const ticket = await request(app)
      .post('/api/v1/tickets/')
      .set('Cookie', global.signin())
      .send({ title: 'Title', price: 20 });

    const responce = await request(app)
      .get('/api/v1/tickets')
      .send()
      .expect(200);
    expect(responce.body).toEqual([ticket.body]);
  });
});

describe('GET /api/v1/tickets/:id', () => {
  it('Returns 404 if no ticket', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
      .get('/api/v1/tickets/' + id)
      .expect(404);
  });
  it('Returns ticket by id', async () => {
    const response = await request(app)
      .post('/api/v1/tickets/')
      .set('Cookie', global.signin())
      .send({ title: 'Title', price: 20 });

    await request(app)
      .get('/api/v1/tickets/' + response.body.id)
      .send()
      .expect(200);
  });
});
