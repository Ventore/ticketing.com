import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  constructor(private errors: ValidationError[]) {
    super();
  }

  status = 400;

  serialize() {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));
  }
}
