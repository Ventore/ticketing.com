import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  status = 400;
  constructor(private reason: string) {
    super();
  }
  serialize() {
    return [{ message: this.reason }];
  }
}
