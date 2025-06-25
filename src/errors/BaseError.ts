import { HttpStatusCode } from "../http";

export interface TBaseError {
  message?: string;
  errorLocationCode?: string;
  statusCode?: number;
  action?: string;
  stack?: string;
  cause?: unknown;
}

export class BaseError extends Error {
  message: string;
  errorLocationCode?: string;
  statusCode: number;
  action: string;
  stack?: string;

  constructor(errorProps: TBaseError = {}) {
    super(errorProps.message || "Error Occurred");

    this.message = errorProps.message || "Error Occurred";
    this.statusCode =
      errorProps.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    this.name = this.constructor.name;
    this.action = errorProps.action || "Please try again later";
    this.errorLocationCode = errorProps.errorLocationCode;
    this.stack = errorProps.stack ?? new Error().stack;
  }
}
