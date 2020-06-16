import { Request, Response, Router, NextFunction } from 'express';
import { Ticket } from '../models/ticket';

const router = Router();

router.get('/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({ orderId: undefined });

  res.send(tickets);
});

router.get(
  '/tickets/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.sendStatus(404);
    }
    res.send(ticket);
  },
);

export { router as readRouter };
