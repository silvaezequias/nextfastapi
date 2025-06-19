# 📦 NextAPI - The lightweight, expressive way to build API routes in Next.js

A minimalist routing controller for building structured APIs in **Next.js App Router**, with Express-style middleware, error handling, and multi-method support.

---

## 🚀 Installation

```bash
npm install nextapi
# or
yarn add nextapi
```

---

## ✨ Features

- Support for `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`, `HEAD`
- Chainable middlewares using `next()` (like Express)
- Global error handler (`onError`)
- Fallback handler for unmatched methods (`onNoMatch`)
- Works seamlessly with `NextRequest` from Next.js App Router

---

## 🧠 Basic Usage

```ts
// app/api/hello/route.ts

import { NextRequest } from "next/server";
import RouteController from "nextapi";
import { UnauthorizedError } from "nextapi/errors";

const controller = new RouteController();

// 🔐 Auth middleware
controller.use(async (req, next) => {
  const token = req.headers.get("authorization");
  if (token !== "Bearer token-123") {
    throw new UnauthorizedError({ message: "Invalid token" });
  }

  (req as any).platformId = "demo"; // example of multi-tenant usage
  return next();
});

// ✅ GET handler
controller.get(async (req) => {
  const platformId = (req as any).platformId;
  return Response.json({ message: `Hello from ${platformId}` });
});

// ❌ Fallback for unmatched methods
controller.onNoMatch(() =>
  Response.json({ error: "Method not allowed" }, { status: 405 })
);

// 🔥 Global error handler
controller.onError((err, _req) => {
  return Response.json(
    { error: err.message, action: err.action },
    { status: err.statusCode }
  );
});

export async function GET(req: NextRequest) {
  return controller.handle(req as any);
}
```

---

## 🔌 Example Middleware

```ts
// middleware/logger.ts
import type { Middleware } from "nextapi";

export const logger: Middleware = async (req, next) => {
  const start = performance.now();
  const res = await next();
  const end = (performance.now() - start).toFixed(2);

  console.info(`${req.method} ${req.url} -> ${res?.status} (${end} ms)`);
  return res;
};
```

---

### 🧠 Request Context (`req.context`)

This object is designed to help you **safely share data** between middlewares and handlers during the same request lifecycle.

#### ✅ Example

```ts
controller.use(async (req, next) => {
  req.context.user = { id: "abc123", role: "admin" };
  return next();
});

controller.get(async (req) => {
  const user = req.context?.user;
  return Response.json({ message: `Hello, ${user?.id}` });
});
```

> ℹ️ `context` is fully customizable. You can use it to store auth data, parsed body, validated input, etc.

---

## ⚠️ Error Handling

You can catch and format any error using `onError`:

```ts
import { RouteController } from "nextapi";
import { BadRequestError } from "nextapi/errors";

const controller = new RouteController();

controller.get(() => {
  throw new BadRequestError({ message: "Invalid input" });
});

controller.onError((err) => {
  return Response.json(
    { error: err.message, hint: err.action },
    { status: err.statusCode }
  );
});
```

> 💡 All thrown errors are normalized and typed — even native `Error` objects.

Built-in HTTP error classes:
_`"nextapi/http"`_

- `BadRequestError` – 400
- `UnauthorizedError` – 401
- `ForbiddenError` – 403
- `NotFoundError` – 404
- `MethodNotAllowedError` – 405
- `ConflictError` – 409
- `UnprocessableEntityError` – 422
- `TooManyRequestsError` – 429
- `InternalError` – 500

Example:

```ts
throw new NotFoundError({ message: "Not found error message" });
```

---

## 📄 License

MIT © 2025 – Developed by Ezequias Lopes
