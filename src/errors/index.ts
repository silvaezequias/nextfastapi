export * from "./BaseError";
export * from "./Errors";

import { InternalError } from "./Errors";
import { BaseError } from "./BaseError";

export function errorToJson(error: BaseError) {
  const { stack, message, ...filtered } = error;

  return {
    ...filtered,
    name: error.constructor?.name,
    message,
  };
}

export function transformError(err: unknown): BaseError {
  if (!(err instanceof Error)) {
    return new InternalError({ message: "Unknown error" });
  }

  if (!(err instanceof BaseError)) {
    return new InternalError({
      message: err.message,
      stack: err.stack,
    });
  }

  return err;
}
