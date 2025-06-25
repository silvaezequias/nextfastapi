import { errorToJson, transformError } from "../errors";
import { ErrorHandler } from "../types/Controller";
import snakeizeKeys from "snakecase-keys";

export const defaultErrorHandler: ErrorHandler = async (error, req, params) => {
  const safe = transformError(error);
  return Response.json(snakeizeKeys(errorToJson(safe)), {
    status: safe.statusCode,
  });
};
