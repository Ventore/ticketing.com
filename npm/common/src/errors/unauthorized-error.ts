import { CustomError } from './custom-error';

export class UnauthorizedRequestError extends CustomError {
  status = 401;
  reason = 'Unauthorized';

  serialize() {
    return [{ message: this.reason }];
  }
}
