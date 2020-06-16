import { Request, Response, Router, NextFunction } from 'express';
import {
  requireAuthentication,
  UnauthorizedRequestError,
  OrderTypes,
} from '@ventore/common';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsService } from '../services/nats-client';

const router = Router();

router.delete(
  '/orders/:id',
  requireAuthentication(),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate('ticket');
    if (!order) {
      return res.sendStatus(404);
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedRequestError();
    }
    order.set('status', OrderTypes.Cancelled);
    await order.save();

    new OrderCancelledPublisher(natsService.client).publish({
      id: order.id,
      ticket: { id: order.ticket.id },
      __v: order.__v,
    });

    res.sendStatus(204);
  },
);

export { router as deleteRouter };
