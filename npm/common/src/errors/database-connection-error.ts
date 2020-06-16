import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to database';
  status = 503;
  constructor() {
    super();
  }
  serialize() {
    return [{ message: this.reason }];
  }
}
