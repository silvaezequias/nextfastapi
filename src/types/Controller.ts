import { Requester } from "../flow/injectRequesterInfo";
import { NextRequest } from "next/server";

export type DefaultContext = Record<string, unknown>;
export type DefaultParams = Record<string, string>;

export interface ControllerRequest<
  Context extends DefaultContext = DefaultContext,
  Params extends DefaultParams = DefaultParams
> extends NextRequest {
  requester: Requester;
  context: Context;
  platformId: string;
}

export type ControllerResponse = Response;
export type NextFn = () => Promise<ControllerResponse>;

export type ErrorHandler<
  Context extends DefaultContext = DefaultContext,
  Params extends DefaultParams = DefaultParams
> = (
  error: unknown,
  req: ControllerRequest<Context, Params>,
  params: Params
) => ControllerResponse | Promise<ControllerResponse>;

export type Middleware<
  Context extends DefaultContext = DefaultContext,
  Params extends DefaultParams = DefaultParams
> = (
  req: ControllerRequest<Context, Params>,
  params: Params,
  next: NextFn
) => ControllerResponse | Promise<ControllerResponse>;
