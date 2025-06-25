# 📦 NextFastAPI — Lightweight API Controller for Next.js (App Router)

NextFastAPI provides an easy way to create structured API routes in **Next.js App Router**, with Express-like middleware support, multi-method handlers, built-in error handling, and strong typing.

---

## 🚀 Installation

```bash
npm install nextfastapi
# or
yarn add nextfastapi
```

---

## 📄 Quick Start

### 1. Create a simple GET router

```ts
// app/api/hello/route.ts

import { RouteController, expose } from "nextfastapi";

const controller = new RouteController();

controller.get(async (req) => {
  return Response.json({ message: "Hello from NextFastAPI!" });
});

export const GET = expose(controller);
```

---

## ⚙️ Middlewares

Middlewares let you run logic before your handlers. You can apply middlewares **globally** (all methods) or **per method**.

---

### 2. Global Middleware (for all methods)

```ts
import type { Middleware } from "nextfastapi/types";

type Context = {
  requestTime?: string;
};

const controller = new RouteController<Context>();

const addRequestTime: Middleware<Context> = (req, params, next) => {
  req.context.requestTime = new Date().toISOString();
  return next();
};

controller.use(addRequestTime);

controller.get((req) => {
  const requestTime = req.context.requestTime;

  return Response.json({ message: `GET Method: ${requestTime}` });
});

controller.post((req) => {
  const requestTime = req.context.requestTime;

  return Response.json({ message: `GET Method: ${requestTime}` });
});

export const GET = expose(controller);
export const POST = expose(controller);
```

---

### 3. Middleware for a Single Method

```ts
import type { Middleware } from "nextfastapi/types";

// Session Control Middleware
import { insertUserRole } from "./middlewares";

type Context = {
  userRole?: "admin" | "user";
};

const controller = new RouteController<Context>();

const checkAdmin: Middleware<Context> = (req, params, next) => {
  if (req.context.userRole !== "admin") {
    throw new ForbiddenError({ message: "You are not ADMIN!" });
  }
  return next();
};

// Inserting Admin Verification Middleware
controller.get(insertUserRole, checkAdmin, (req) => {
  return Response.json({ secret: "This is admin only" });
});

controller.post((req) => {
  return Response.json({ secret: "This secret is PUBLIC" });
});

export const GET = expose(controller);
export const POST = expose(controller);
```

---

## ⚠️ Error Handling

NextFastAPI comes with a built-in error manager that formats errors automatically.

### 4. Using Built-in HTTP Errors

```ts
controller.get((req) => {
  throw new BadRequestError({ message: "Custom Bad Request Error Message" });
});

export const GET = expose(controller);
export const POST = expose(controller);
```

---

### 5. Custom Error Handler (optional)

```ts
import { transformError } from "nextfastapi/errors";

controller.onError((err, req) => {
  // parse js built in error for a base object
  const safeError = transformError(err);

  const response = {
    error: safeError.message,
    action: safeError.action, // default action message added by error classes
  };

  return Response.json(response, {
    status: safeError.statusCode,
  });
});
```

---

## 📚 Available HTTP Error Classes

| Error Class                | HTTP Status Code | Default Action Message                              |
| -------------------------- | ---------------- | --------------------------------------------------- |
| `BadRequestError`          | 400              | "Check the request data and try again."             |
| `UnauthorizedError`        | 401              | "Provide valid authentication credentials."         |
| `ForbiddenError`           | 403              | "Ensure you have permission to access this."        |
| `NotFoundError`            | 404              | "Verify the resource identifier and try again."     |
| `MethodNotAllowedError`    | 405              | "Use a supported HTTP method for this endpoint."    |
| `ConflictError`            | 409              | "Resolve conflicting data before retrying."         |
| `UnprocessableEntityError` | 422              | "Check the entity's data validity and constraints." |
| `TooManyRequestsError`     | 429              | "Reduce request frequency or wait before retrying." |
| `InternalError`            | 500              | "Try again later or contact support."               |

---

## 💡 Summary

- Create routes with `.get()`, `.post()`, etc., and export with `expose`.
- Add middlewares globally with `.use()` or per method by passing them as arguments.
- Use built-in HTTP error classes for standardized errors.
- Customize error responses with `.onError()` if you want.
- `req.context` allows sharing data between middlewares and handlers.

---

## 📄 License

MIT © 2025 – Developed by **Ezequias Lopes**
