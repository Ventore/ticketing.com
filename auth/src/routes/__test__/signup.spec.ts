import request from 'supertest';
import { app } from '../../app';

describe('POST /api/v1/users/signup', () => {
  it('Creates user', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201);
  });

  it('Sets cookie', async () => {
    const response = await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });

  it('User must be unique', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201);

    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(400);
  });

  it('Validates email', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'testtestcom', password: 'password' })
      .expect(400);

    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: '', password: 'password' })
      .expect(400);
  });

  it('Validates password', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'test@test.com', password: '11111' })
      .expect(400);

    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'test@test.com', password: '' })
      .expect(400);
  });
});
