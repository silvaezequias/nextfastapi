import { BaseError, TBaseError } from "./BaseError";
import { HttpStatusCode } from "../http";

export class InternalError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Internal Server Error",
      statusCode: errorProps.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
}

export class BadRequestError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Bad Request",
      statusCode: errorProps.statusCode || HttpStatusCode.BAD_REQUEST,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Unauthorized",
      statusCode: errorProps.statusCode || HttpStatusCode.UNAUTHORIZED,
    });
  }
}

export class ForbiddenError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "No Permission",
      statusCode: errorProps.statusCode || HttpStatusCode.FORBIDDEN,
    });
  }
}

export class NotFoundError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Not Found",
      statusCode: errorProps.statusCode || HttpStatusCode.NOT_FOUND,
    });
  }
}

export class ConflictError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Conflict",
      statusCode: errorProps.statusCode || HttpStatusCode.CONFLICT,
    });
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Unprocessable Entity",
      statusCode: errorProps.statusCode || HttpStatusCode.UNPROCESSABLE_ENTITY,
    });
  }
}

export class TooManyRequestsError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Too Many Requests",
      statusCode: errorProps.statusCode || HttpStatusCode.TOO_MANY_REQUESTS,
    });
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Method Not Allowed",
      statusCode: errorProps.statusCode || HttpStatusCode.METHOD_NOT_ALLOWED,
    });
  }
}
