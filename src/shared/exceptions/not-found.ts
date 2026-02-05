import { type ErrorCode, type ErrorMessages, HttpException } from "./root";

export class NotFoundException extends HttpException {
  constructor(message: ErrorMessages, errorCode: ErrorCode) {
    super(message, 404, errorCode, null);
  }
}
