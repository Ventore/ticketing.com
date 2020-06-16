import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError, currentUser } from '@ventore/common';
import { User } from '../models/user';
import { Password } from '../services/password';

const UserRouter = Router();

UserRouter.get('/current', currentUser(), (req: Request, res: Response) => {
  res.send({ user: req.currentUser || null });
});
UserRouter.post(
  '/signin',
  [body('email').isEmail(), body('password').trim().notEmpty()],
  validateRequest(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new BadRequestError('Invalid credentials'));
    }

    const isValidPassword = await Password.compare(
      existingUser.password,
      password,
    );
    if (!isValidPassword) {
      return next(new BadRequestError('Invalid credentials'));
    }

    const userToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWS_KEY!,
    );

    req.session = {
      jwt: userToken,
    };

    res.send(existingUser);
  },
);
UserRouter.post(
  '/signup',
  [
    body('email').isEmail(),
    body('password').trim().isLength({ min: 8, max: 20 }),
  ],
  validateRequest(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new BadRequestError('Email in use'));
    }

    const user = User.build({ email, password });

    await user.save();

    const userToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWS_KEY!,
    );

    req.session = {
      jwt: userToken,
    };

    res.status(201).send(user);
  },
);

UserRouter.post('/signout', (req, res, next) => {
  req.session = null;
  res.sendStatus(200);
});

export { UserRouter };
