import { Request, Response, Router, NextFunction } from 'express';
import {
  requireAuthentication,
  UnauthorizedRequestError,
} from '@ventore/common';
import { Order } from '../models/order';

const router = Router();

router.get(
  '/orders',
  requireAuthentication(),
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate('ticket');
    res.send(orders);
  },
);

router.get(
  '/orders/:id',
  requireAuthentication(),
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).populate('ticket');
    if (!order) {
      return res.sendStatus(404);
    }
    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedRequestError();
    }
    res.send(order);
  },
);

export { router as readRouter };
