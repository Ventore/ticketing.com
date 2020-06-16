import request from 'supertest';
import { app } from '../../app';

describe('GET /api/v1/users/current', () => {
  it('Returns current user', async () => {
    const cookie = await global.signin();

    const response = await request(app)
      .get('/api/v1/users/current')
      .set('Cookie', cookie)
      .send()
      .expect(200);

    expect(response.body.user.email).toEqual('test@test.com');
  });

  it('Returns null', async () => {
    const response = await request(app)
      .get('/api/v1/users/current')
      .send()
      .expect(200);

    expect(response.body.user).toEqual(null);
  });
});
