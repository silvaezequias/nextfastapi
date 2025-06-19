import { NextRequest } from "next/server";
import { errorToJson, MethodNotAllowedError, transformError } from "./errors";
import { HttpMethod } from "./http";

export interface ControllerRequest extends NextRequest {
  platformId: string;
  context: Record<string, any>;
}

export type ControllerResponse = Response | undefined;
export type NextFn = () => Promise<ControllerResponse>;

export type Middleware = (
  req: ControllerRequest,
  next: NextFn
) => Promise<ControllerResponse>;

export type RequestHandler = (req: ControllerRequest) => Promise<Response>;
export type ErrorHandler = (
  error: unknown,
  req: ControllerRequest
) => Promise<Response>;

export class RouteController {
  private readonly middlewares: Middleware[] = [];
  private readonly handlers: Partial<Record<HttpMethod, RequestHandler>> = {};

  private errorHandler?: ErrorHandler;
  private noMatchHandler?: RequestHandler;

  use(...middleware: Middleware[]): this {
    this.middlewares.push(...middleware);
    return this;
  }

  get(handler: RequestHandler) {
    return this.register("GET", handler);
  }
  post(handler: RequestHandler) {
    return this.register("POST", handler);
  }
  put(handler: RequestHandler) {
    return this.register("PUT", handler);
  }
  delete(handler: RequestHandler) {
    return this.register("DELETE", handler);
  }
  patch(handler: RequestHandler) {
    return this.register("PATCH", handler);
  }
  options(handler: RequestHandler) {
    return this.register("OPTIONS", handler);
  }
  head(handler: RequestHandler) {
    return this.register("HEAD", handler);
  }

  onError(handler: ErrorHandler): this {
    this.errorHandler = handler;
    return this;
  }

  onNoMatch(handler: RequestHandler): this {
    this.noMatchHandler = handler;
    return this;
  }

  async handle(req: ControllerRequest): Promise<Response> {
    try {
      req.context = req.context || {};

      const middlewareResult = await this.runMiddlewares(req, 0);
      if (middlewareResult) return middlewareResult;

      const method = req.method.toUpperCase() as HttpMethod;
      const handler = this.handlers[method];

      if (handler) return await handler(req);
      if (this.noMatchHandler) return await this.noMatchHandler(req);

      throw new MethodNotAllowedError();
    } catch (err) {
      const safeError = transformError(err);
      if (this.errorHandler) {
        return await this.errorHandler(safeError, req);
      }

      return Response.json(errorToJson(safeError), {
        status: safeError.statusCode,
      });
    }
  }

  private register(method: HttpMethod, handler: RequestHandler): this {
    this.handlers[method] = handler;
    return this;
  }

  private async runMiddlewares(
    req: ControllerRequest,
    index: number
  ): Promise<ControllerResponse> {
    if (index >= this.middlewares.length) return undefined;

    const middleware = this.middlewares[index];
    return middleware(req, () => this.runMiddlewares(req, index + 1));
  }
}

export default RouteController;
