import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuthentication,
  validateRequest,
  UnauthorizedRequestError,
  OrderTypes,
  BadRequestError,
} from '@ventore/common';
import { Order } from '../models/order';
import { stripeClient } from '../services/stripe-client';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsService } from '../services/nats-client';
const router = Router();

router.post(
  '/payments',
  requireAuthentication(),
  [body('token').notEmpty(), body('orderId').notEmpty()],
  validateRequest(),
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.sendStatus(404);
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedRequestError();
    }
    if (order.status === OrderTypes.Cancelled) {
      throw new BadRequestError('Order was cancelled');
    }

    const charge = await stripeClient.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({ orderId: order.id, stripeId: charge.id });

    await payment.save();

    await new PaymentCreatedPublisher(natsService.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.sendStatus(201);
  },
);

export { router as createRouter };
