import Stripe from 'stripe';

if (!process.env.STRIPE_KEY) {
  throw new Error('STRIPE_KEY is not provided');
}

export const stripeClient = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2020-03-02',
});
