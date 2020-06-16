import { Schema, model, Model, Document } from 'mongoose';
import { Password } from '../services/password';

interface User {
  email: string;
  password: string;
}

interface UserDocument extends Document, User {}

interface UserModel extends Model<UserDocument> {
  build(user: User): UserDocument;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  },
);

userSchema.statics.build = (user: User) => {
  return new userModel(user);
};

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

const userModel = model<UserDocument, UserModel>('User', userSchema);

export { userModel as User };
