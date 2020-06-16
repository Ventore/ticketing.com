import { Request, Response, NextFunction } from 'express';
import { UnauthorizedRequestError } from '../errors/unauthorized-error';

export const requireAuthentication = () => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.currentUser) {
    return next(new UnauthorizedRequestError());
  }
  next();
};
