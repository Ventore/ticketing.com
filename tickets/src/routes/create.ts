import { Request, Response, Router } from 'express';
import { requireAuthentication, validateRequest } from '@ventore/common';
import { Ticket } from '../models/ticket';
import { validTicket } from '../middlewares/validTicket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsService } from '../services/nats-client';

const router = Router();

router.post(
  '/tickets',
  requireAuthentication(),
  validTicket(),
  validateRequest(),
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const { id } = req.currentUser!;

    const ticket = Ticket.build({ title, price, userId: id });
    await ticket.save();

    new TicketCreatedPublisher(natsService.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      __v: ticket.__v!,
    });

    res.status(201).send(ticket);
  },
);

export { router as createRouter };
