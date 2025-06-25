import { BaseError, TBaseError } from "./BaseError";
import { HttpStatusCode } from "../http";

export class InternalError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Internal Server Error",
      statusCode: errorProps.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR,
      action: errorProps.action || "Try again later or contact support.",
    });
  }
}

export class BadRequestError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Bad Request",
      statusCode: errorProps.statusCode || HttpStatusCode.BAD_REQUEST,
      action: errorProps.action || "Check the request data and try again.",
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Unauthorized",
      statusCode: errorProps.statusCode || HttpStatusCode.UNAUTHORIZED,
      action: errorProps.action || "Provide valid authentication credentials.",
    });
  }
}

export class ForbiddenError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "No Permission",
      statusCode: errorProps.statusCode || HttpStatusCode.FORBIDDEN,
      action:
        errorProps.action ||
        "Ensure you have permission to access this resource.",
    });
  }
}

export class NotFoundError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Not Found",
      statusCode: errorProps.statusCode || HttpStatusCode.NOT_FOUND,
      action:
        errorProps.action || "Verify the resource identifier and try again.",
    });
  }
}

export class ConflictError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Conflict",
      statusCode: errorProps.statusCode || HttpStatusCode.CONFLICT,
      action: errorProps.action || "Resolve conflicting data before retrying.",
    });
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Unprocessable Entity",
      statusCode: errorProps.statusCode || HttpStatusCode.UNPROCESSABLE_ENTITY,
      action:
        errorProps.action ||
        "Check the entity's data validity and constraints.",
    });
  }
}

export class TooManyRequestsError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Too Many Requests",
      statusCode: errorProps.statusCode || HttpStatusCode.TOO_MANY_REQUESTS,
      action:
        errorProps.action ||
        "Reduce request frequency or wait before retrying.",
    });
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor(errorProps: TBaseError = {}) {
    super({
      ...errorProps,
      message: errorProps.message || "Method Not Allowed",
      statusCode: errorProps.statusCode || HttpStatusCode.METHOD_NOT_ALLOWED,
      action:
        errorProps.action || "Use a supported HTTP method for this endpoint.",
    });
  }
}
