import { Schema, Document, Model, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderTypes } from '@ventore/common';

interface OrderAttrs {
  id: string;
  userId: string;
  price: number;
  status: OrderTypes;
  __v: number;
}
interface OrderDocument extends OrderAttrs, Document {
  id: string;
  __v: number;
}
interface OrderModel extends Model<OrderDocument> {
  build(attr: OrderAttrs): OrderDocument;
}

const schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderTypes),
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

schema.statics.build = (attr: OrderAttrs) => {
  return new Order({
    _id: attr.id,
    userId: attr.userId,
    price: attr.price,
    status: attr.status,
    __v: attr.__v,
  });
};

schema.plugin(updateIfCurrentPlugin);

export const Order = model<OrderDocument, OrderModel>('Order', schema);
