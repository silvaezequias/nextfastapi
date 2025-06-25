import { MethodNotAllowedError } from "../../errors";
import { HttpMethod } from "../../http";
import { defaultErrorHandler } from "../errorHandler";
import { runMiddlewares } from "../runner";
import { expose } from "./expose";

import {
  ControllerRequest,
  DefaultContext,
  DefaultParams,
  ErrorHandler,
  Middleware,
} from "../../types/Controller";

export class RouteController<
  Context extends DefaultContext = DefaultContext,
  Params extends DefaultParams = DefaultParams
> {
  private readonly globalMiddlewares: Middleware<Context, Params>[] = [];
  private readonly handlers: Partial<
    Record<HttpMethod, { middlewares: Middleware<Context, Params>[] }>
  > = {};

  private errorHandler?: ErrorHandler<Context, Params>;
  private noMatchHandler?: Middleware<Context, Params>;

  use(...middleware: Middleware<Context, Params>[]): this {
    this.globalMiddlewares.push(...middleware);
    return this;
  }

  get(...middlewares: Middleware<Context, Params>[]) {
    return this.registerWithMiddleware("GET", middlewares);
  }

  post(...middlewares: Middleware<Context, Params>[]) {
    return this.registerWithMiddleware("POST", middlewares);
  }

  put(...middlewares: Middleware<Context, Params>[]) {
    return this.registerWithMiddleware("PUT", middlewares);
  }

  delete(...middlewares: Middleware<Context, Params>[]) {
    return this.registerWithMiddleware("DELETE", middlewares);
  }

  patch(...middlewares: Middleware<Context, Params>[]) {
    return this.registerWithMiddleware("PATCH", middlewares);
  }

  options(...middlewares: Middleware<Context, Params>[]) {
    return this.registerWithMiddleware("OPTIONS", middlewares);
  }

  head(...middlewares: Middleware<Context, Params>[]) {
    return this.registerWithMiddleware("HEAD", middlewares);
  }

  onError(handler: ErrorHandler<Context, Params>): this {
    this.errorHandler = handler;
    return this;
  }

  onNoMatch(handler: Middleware<Context, Params>): this {
    this.noMatchHandler = handler;
    return this;
  }

  async handle(
    req: ControllerRequest<Context, Params>,
    params: Params = {} as Params
  ): Promise<Response> {
    try {
      req.context = req.context || ({} as Context);

      const method = req.method.toUpperCase() as HttpMethod;
      const entry = this.handlers[method];

      const allMiddlewares: Middleware<Context, Params>[] = [
        ...this.globalMiddlewares,
        ...(entry?.middlewares ?? []),
        this.noMatchHandler ??
          (() => {
            throw new MethodNotAllowedError();
          }),
      ];

      return await runMiddlewares<Context, Params>(req, params, allMiddlewares);
    } catch (err) {
      const handler = this.errorHandler ?? defaultErrorHandler;
      return await handler(err, req, params);
    }
  }

  private registerWithMiddleware(
    method: HttpMethod,
    middlewares: Middleware<Context, Params>[]
  ): this {
    this.handlers[method] = { middlewares };
    return this;
  }
}

export { expose };
