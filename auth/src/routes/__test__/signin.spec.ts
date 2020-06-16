import request from 'supertest';
import { app } from '../../app';

describe('POST /api/v1/users/signin', () => {
  it('Authenticates user', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201);

    await request(app)
      .post('/api/v1/users/signin')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(200);
  });

  it('Sets cookie', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201);

    const response = await request(app)
      .post('/api/v1/users/signin')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });

  it('Validates user', async () => {
    await request(app)
      .post('/api/v1/users/signin')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(400);
  });

  it('Validates password', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201);

    await request(app)
      .post('/api/v1/users/signin')
      .send({ email: 'test@test.com', password: 'passwor' })
      .expect(400);
  });
});
