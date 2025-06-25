import { InternalError } from "../errors";
import {
  ControllerRequest,
  ControllerResponse,
  Middleware,
  DefaultContext,
  DefaultParams,
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
