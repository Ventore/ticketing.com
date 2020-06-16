import { Document, Model, Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderTypes } from './order';

interface TicketAttr {
  ticketId: string;
  title: string;
  price: number;
}
export interface TicketDocument extends Document, TicketAttr {
  __v: number;
  isReserved(): Promise<boolean>;
}
interface TicketModel extends Model<TicketDocument> {
  build(attr: TicketAttr): TicketDocument;
  findByEvent(event: {
    id: string;
    __v: number;
  }): Promise<TicketDocument | null>;
}

const schema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

schema.plugin(updateIfCurrentPlugin);

schema.statics.build = ({ ticketId, ...attr }: TicketAttr) => {
  return new Ticket({
    _id: ticketId,
    ...attr,
  });
};

schema.statics.findByEvent = async (event: { id: string; __v: number }) => {
  const ticket = await Ticket.findOne({ _id: event.id, __v: event.__v - 1 });
  if (!ticket) {
    return null;
  }
  return ticket;
};

schema.methods.isReserved = async function isReserved() {
  const exist = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderTypes.Created,
        OrderTypes.AwaitingPayment,
        OrderTypes.Complete,
      ],
    },
  });
  return !!exist;
};

export const Ticket = model<TicketDocument, TicketModel>('Ticket', schema);
