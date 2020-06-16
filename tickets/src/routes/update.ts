import { Request, Response, Router } from 'express';
import {
  requireAuthentication,
  validateRequest,
  UnauthorizedRequestError,
  BadRequestError,
} from '@ventore/common';
import { validTicket } from '../middlewares/validTicket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsService } from '../services/nats-client';
import { Ticket } from '../models/ticket';

const router = Router();

router.put(
  '/tickets/:ticketId',
  requireAuthentication(),
  validTicket(),
  validateRequest(),
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.sendStatus(404);
    }
    if (ticket.userId !== req.currentUser?.id) {
      throw new UnauthorizedRequestError();
    }
    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    ticket.set({ title: req.body.title, price: req.body.price });
    await ticket.save();

    new TicketUpdatedPublisher(natsService.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      __v: ticket.__v!,
    });

    res.send(ticket);
  },
);

export { router as updateRouter };
