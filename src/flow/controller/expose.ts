import { RouteController } from ".";
import {
  ControllerRequest,
  DefaultContext,
  DefaultParams,
} from "../../types/Controller";

export function expose<
  Context extends DefaultContext = DefaultContext,
  Params extends DefaultParams = DefaultParams
>(controller: RouteController<Context, Params>) {
  return (
    req: ControllerRequest<Context, Params>,
    context: { params: Params }
  ) => controller.handle(req, context.params);
}
