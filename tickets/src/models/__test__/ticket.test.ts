import { Ticket } from '../ticket';

describe('Ticket model', () => {
  it('Implements Optimistic Concurrency Control (OCC)', async (done) => {
    const ticket = await Ticket.build({
      title: 'Title',
      price: 10,
      userId: '1',
    });

    await ticket.save();

    const ticket1 = await Ticket.findById(ticket.id);
    const ticket2 = await Ticket.findById(ticket.id);

    ticket1!.set('price', 20);
    ticket2!.set('price', 15);

    await ticket1!.save();

    try {
      await ticket2!.save();
    } catch (error) {
      return done();
    }

    throw new Error('Test failed');
  });
});
