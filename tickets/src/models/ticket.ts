import { Schema, model, Document, Model, plugin } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttr {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
}
interface TicketDocument extends TicketAttr, Document {
  __v: number;
}
interface TicketModel extends Model<TicketDocument> {
  build(ticket: TicketAttr): TicketDocument;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (ticket: TicketAttr) => {
  return new Ticket(ticket);
};

export const Ticket = model<TicketDocument, TicketModel>(
  'Ticket',
  ticketSchema,
);
