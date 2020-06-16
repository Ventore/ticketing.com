import { Request, Response, Router } from 'express';
import {
  requireAuthentication,
  validateRequest,
  BadRequestError,
  OrderTypes,
} from '@ventore/common';
import { natsService } from '../services/nats-client';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const EXPIRATION_WINDOW_SEC = 1 * 60;

const router = Router();

router.post(
  '/orders',
  requireAuthentication(),
  [
    body('ticketId')
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)),
  ],
  validateRequest(),
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.sendStatus(404);
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SEC);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderTypes.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    new OrderCreatedPublisher(natsService.client).publish({
      id: order.id,
      ticket: { id: ticket.id, price: ticket.price },
      userId: req.currentUser!.id,
      expiresAt: expiration.toISOString(),
      status: OrderTypes.Created,
      __v: order.__v,
    });

    res.status(201).send(order);
  },
);

export { router as createRouter };
