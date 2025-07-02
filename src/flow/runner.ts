import { InternalError } from "../errors";
import {
  ControllerRequest,
  ControllerResponse,
  Middleware,
  DefaultContext,
  DefaultParams,
  ErrorMiddleware,
} from "../types/Controller";

export async function runMiddlewares<
  Context extends DefaultContext = DefaultContext,
  Params extends DefaultParams = DefaultParams
>(
  req: ControllerRequest<Context, Params>,
  params: Params,
  list: Middleware<Context, Params>[],
  index = 0
): Promise<ControllerResponse> {
  if (index >= list.length) {
    throw new InternalError({
      message: "No middleware handled the request",
      errorLocationCode: ">NFA:MIDDLEWARE:RUNNER",
    });
  }

  const mw = list[index];
  return await mw(req, params, () =>
    runMiddlewares(req, params, list, index + 1)
  );
}

export async function runErrorMiddlewares<
  Context extends DefaultContext = DefaultContext,
  Params extends DefaultParams = DefaultParams
>(
  error: unknown,
  req: ControllerRequest<Context, Params>,
  params: Params,
  list: ErrorMiddleware<Context, Params>[],
  index = 0
): Promise<ControllerResponse> {
  const mw = list[index];
  return await mw(error, req, params, () =>
    runErrorMiddlewares(error, req, params, list, index + 1)
  );
}

export async function runNoMatchErrorMiddlewares<
  Context extends DefaultContext = DefaultContext,
  Params extends DefaultParams = DefaultParams
>(
  error: unknown,
  req: ControllerRequest<Context, Params>,
  params: Params,
  list: ErrorMiddleware<Context, Params>[],
  index = 0
): Promise<ControllerResponse> {
  const mw = list[index];
  return await mw(error, req, params, () =>
    runNoMatchErrorMiddlewares(error, req, params, list, index + 1)
  );
}
