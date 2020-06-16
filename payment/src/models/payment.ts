import { Schema, Document, Model, model } from 'mongoose';
import { OrderTypes } from '@ventore/common';

interface PaymentAttr {
  orderId: string;
  stripeId: string;
}

interface PaymentDocument extends PaymentAttr, Document {}

interface PaymentModel extends Model<PaymentDocument> {
  build(attr: PaymentAttr): PaymentDocument;
}

const schema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
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

schema.statics.build = (attr: PaymentAttr): PaymentDocument => {
  return new Payment(attr);
};

export const Payment = model<PaymentDocument, PaymentModel>('Payment', schema);
