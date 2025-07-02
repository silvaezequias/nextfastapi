import { MethodNotAllowedError } from "../../errors";
import { HttpMethod } from "../../http";
import {
  defaultErrorHandler,
  defaultNoMatchHandler,
} from "../middlewares/utils/errorHandler";
import { runErrorMiddlewares, runMiddlewares } from "../runner";
import { expose } from "./expose";

import {
  ControllerRequest,
  DefaultContext,
  DefaultParams,
  ErrorMiddleware,
  Middleware,
} from "../../types/Controller";

export class RouteController<
  Context extends DefaultContext = DefaultContext,
  Params extends DefaultParams = DefaultParams
> {
  private readonly errorMiddlewares: ErrorMiddleware<Context, Params>[] = [];
  private readonly noMatchMiddlewares: Middleware<Context, Params>[] = [];
  private readonly globalMiddlewares: Middleware<Context, Params>[] = [];
  private readonly handlers: Partial<
    Record<HttpMethod, { middlewares: Middleware<Context, Params>[] }>
  > = {};

  public expose = () => expose(this);

  use<C extends Context = Context, P extends Params = Params>(
    ...middleware: Middleware<C, P>[]
  ): this {
    this.globalMiddlewares.push(
      ...(middleware as Middleware<Context, Params>[])
    );
    return this;
  }

  get<C extends Context = Context, P extends Params = Params>(
    ...middlewares: Middleware<C, P>[]
  ) {
    return this.registerWithMiddleware(
      "GET",
      middlewares as Middleware<Context, Params>[]
    );
  }

  post<C extends Context = Context, P extends Params = Params>(
    ...middlewares: Middleware<C, P>[]
  ) {
    return this.registerWithMiddleware(
      "POST",
      middlewares as Middleware<Context, Params>[]
    );
  }

  put<C extends Context = Context, P extends Params = Params>(
    ...middlewares: Middleware<C, P>[]
  ) {
    return this.registerWithMiddleware(
      "PUT",
      middlewares as Middleware<Context, Params>[]
    );
  }

  delete<C extends Context = Context, P extends Params = Params>(
    ...middlewares: Middleware<C, P>[]
  ) {
    return this.registerWithMiddleware(
      "DELETE",
      middlewares as Middleware<Context, Params>[]
    );
  }

  patch<C extends Context = Context, P extends Params = Params>(
    ...middlewares: Middleware<C, P>[]
  ) {
    return this.registerWithMiddleware(
      "PATCH",
      middlewares as Middleware<Context, Params>[]
    );
  }

  options<C extends Context = Context, P extends Params = Params>(
    ...middlewares: Middleware<C, P>[]
  ) {
    return this.registerWithMiddleware(
      "OPTIONS",
      middlewares as Middleware<Context, Params>[]
    );
  }

  head<C extends Context = Context, P extends Params = Params>(
    ...middlewares: Middleware<C, P>[]
  ) {
    return this.registerWithMiddleware(
      "HEAD",
      middlewares as Middleware<Context, Params>[]
    );
  }

  onError<C extends Context = Context, P extends Params = Params>(
    ...middlewares: ErrorMiddleware<C, P>[]
  ) {
    this.registerErrorMiddleware(
      middlewares as ErrorMiddleware<Context, Params>[]
    );
    return this;
  }

  onNoMatch<C extends Context = Context, P extends Params = Params>(
    ...middlewares: Middleware<C, P>[]
  ) {
    this.registerNoMatchMiddleware(
      middlewares as Middleware<Context, Params>[]
    );
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

      this.registerNoMatchMiddleware([defaultNoMatchHandler]);

      const allMiddlewares: Middleware<Context, Params>[] = [
        ...this.globalMiddlewares,
        ...(entry?.middlewares ?? []),
        ...this.noMatchMiddlewares,
      ];

      return await runMiddlewares<Context, Params>(req, params, allMiddlewares);
    } catch (err) {
      const allMiddlewares: ErrorMiddleware<Context, Params>[] = [
        ...this.errorMiddlewares,
        defaultErrorHandler,
      ];

      return await runErrorMiddlewares<Context, Params>(
        err,
        req,
        params,
        allMiddlewares
      );
    }
  }

  private registerWithMiddleware(
    method: HttpMethod,
    middlewares: Middleware<Context, Params>[]
  ): this {
    this.handlers[method] = { middlewares };
    return this;
  }

  private registerErrorMiddleware(
    middlewares: ErrorMiddleware<Context, Params>[]
  ) {
    this.errorMiddlewares.push(...middlewares);
    return this;
  }

  private registerNoMatchMiddleware(
    middlewares: Middleware<Context, Params>[]
  ) {
    this.noMatchMiddlewares.push(...middlewares);
    return this;
  }
}

export { expose };
