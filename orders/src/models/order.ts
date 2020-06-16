import { Document, Model, Schema, model } from 'mongoose';
import { OrderTypes } from '@ventore/common';
import { TicketDocument } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttr {
  userId: string;
  status: OrderTypes;
  expiresAt: Date;
  ticket: TicketDocument;
}

interface OrderDocument extends Document, OrderAttr {
  __v: number;
}

interface OrderModel extends Model<OrderDocument> {
  build(attr: OrderAttr): OrderDocument;
}

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderTypes),
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
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

orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attr: OrderAttr) => {
  return new Order(attr);
};

const Order = model<OrderDocument, OrderModel>('Order', orderSchema);

export { OrderTypes, Order };
