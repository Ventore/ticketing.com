import { json } from 'body-parser';

export const stripeClient = {
  charges: {
    create: jest.fn().mockResolvedValue({id: '1'}),
  },
};
