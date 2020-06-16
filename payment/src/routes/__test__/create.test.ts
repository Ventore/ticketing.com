import request from 'supertest';
import { app } from '../../app';
import { Types } from 'mongoose';
import { Order } from '../../models/order';
import { OrderTypes } from '@ventore/common';
import { stripeClient } from '../../services/stripe-client';
import { Payment } from '../../models/payment';

describe('POST /api/v1/payments', () => {
  it('Validates orderId', async () => {
    await request(app)
      .post('/api/v1/payments')
      .set('Cookie', global.signin())
      .send({ orderId: Types.ObjectId().toHexString(), token: 'tocken' })
      .expect(404);
  });
  it('Validates Same User Policy', async () => {
    const userId = Types.ObjectId().toHexString();
    const order = await Order.build({
      id: Types.ObjectId().toHexString(),
      userId,
      price: 20,
      status: OrderTypes.Created,
      __v: 0,
    }).save();

    await request(app)
      .post('/api/v1/payments')
      .set('Cookie', global.signin())
      .send({ orderId: order.id, token: 'tocken' })
      .expect(401);
    await request(app)
      .post('/api/v1/payments')
      .set('Cookie', global.signin(userId))
      .send({ orderId: order.id, token: 'tocken' })
      .expect(201);
  });
  it('Validates order status', async () => {
    const userId = Types.ObjectId().toHexString();
    const order = await Order.build({
      id: Types.ObjectId().toHexString(),
      userId,
      price: 20,
      status: OrderTypes.Cancelled,
      __v: 0,
    }).save();

    await request(app)
      .post('/api/v1/payments')
      .set('Cookie', global.signin(userId))
      .send({ orderId: order.id, token: 'tocken' })
      .expect(400);
  });

  it('Create valid payment', async () => {
    const userId = Types.ObjectId().toHexString();
    const order = await Order.build({
      id: Types.ObjectId().toHexString(),
      userId,
      price: 20,
      status: OrderTypes.Created,
      __v: 0,
    }).save();

    await request(app)
      .post('/api/v1/payments')
      .set('Cookie', global.signin(userId))
      .send({ orderId: order.id, token: 'tok_visa' })
      .expect(201);

    const payment = await Payment.findOne({ orderId: order.id });

    expect(stripeClient.charges.create).toBeCalled();
    expect(payment).toBeTruthy();
  });
});
