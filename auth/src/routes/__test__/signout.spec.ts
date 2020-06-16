import request from 'supertest';
import { app } from '../../app';

describe('POST /api/v1/users/signout', () => {
  it('Removes cookies', async () => {
    await request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201);

    const response = await request(app)
      .post('/api/v1/users/signout')
      .send({})
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
