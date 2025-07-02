import {
  errorToJson,
  MethodNotAllowedError,
  transformError,
} from "../../../errors";

import { ErrorMiddleware, Middleware } from "../../../types/Controller";
import snakeizeKeys from "snakecase-keys";

export const defaultErrorHandler: ErrorMiddleware = async (error) => {
  const safe = transformError(error);
  return Response.json(snakeizeKeys(errorToJson(safe)), {
    status: safe.statusCode,
  });
};

export const defaultNoMatchHandler: Middleware = async () => {
  throw new MethodNotAllowedError();
};
