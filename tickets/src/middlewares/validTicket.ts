import { body } from 'express-validator';

export const validTicket = () => {
  return [
    body('title').notEmpty().isLength({ max: 80 }).trim(),
    body('price').notEmpty().isFloat({ gt: 0, max: 100000 }),
  ];
};
