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

  public expose = () => expose(this);

  use<C extends Context = Context>(
    ...middleware: Middleware<C, Params>[]
  ): this {
    this.globalMiddlewares.push(
      ...(middleware as Middleware<Context, Params>[])
    );
    return this;
  }

  get<C extends Context = Context>(...middlewares: Middleware<C, Params>[]) {
    return this.registerWithMiddleware(
      "GET",
      middlewares as Middleware<Context, Params>[]
    );
  }

  post<C extends Context = Context>(...middlewares: Middleware<C, Params>[]) {
    return this.registerWithMiddleware(
      "POST",
      middlewares as Middleware<Context, Params>[]
    );
  }

  put<C extends Context = Context>(...middlewares: Middleware<C, Params>[]) {
    return this.registerWithMiddleware(
      "PUT",
      middlewares as Middleware<Context, Params>[]
    );
  }

  delete<C extends Context = Context>(...middlewares: Middleware<C, Params>[]) {
    return this.registerWithMiddleware(
      "DELETE",
      middlewares as Middleware<Context, Params>[]
    );
  }

  patch<C extends Context = Context>(...middlewares: Middleware<C, Params>[]) {
    return this.registerWithMiddleware(
      "PATCH",
      middlewares as Middleware<Context, Params>[]
    );
  }

  options<C extends Context = Context>(
    ...middlewares: Middleware<C, Params>[]
  ) {
    return this.registerWithMiddleware(
      "OPTIONS",
      middlewares as Middleware<Context, Params>[]
    );
  }

  head<C extends Context = Context>(...middlewares: Middleware<C, Params>[]) {
    return this.registerWithMiddleware(
      "HEAD",
      middlewares as Middleware<Context, Params>[]
    );
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
