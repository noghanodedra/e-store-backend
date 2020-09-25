import { StatusCodes } from 'http-status-codes';

export class GeneralError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }

  public getCode(): number {
    if (this instanceof BadRequest) {
      return StatusCodes.BAD_REQUEST;
    }
    if (this instanceof CustomValidationError) {
      return StatusCodes.CONFLICT;
    }
    if (this instanceof NotFound) {
      return StatusCodes.NOT_FOUND;
    }
    return StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export class BadRequest extends GeneralError {}
export class CustomValidationError extends GeneralError {}
export class NotFound extends GeneralError {}
