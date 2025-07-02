import { Middleware } from "../../types/Controller";

export interface Requester {
  ip: string;
  userAgent?: string;
  forwarded?: {
    for: string[];
  };
  device?: {
    isMobile?: boolean;
    isBot?: boolean;
  };
}

export const RequesterInjector: Middleware = (req, _, next) => {
  const headers = req.headers;

  const userAgent = headers.get("user-agent") ?? undefined;
  const forwardedFor = headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);

  const cfConnectingIp = headers.get("cf-connecting-ip");
  const realIp = headers.get("x-real-ip");
  const fallback = "0.0.0.0";

  req.requester = {
    ip: forwardedFor?.[0] || realIp || cfConnectingIp || fallback,
    userAgent,
    forwarded: forwardedFor ? { for: forwardedFor } : undefined,
    device: {
      isMobile: /mobile/i.test(userAgent || ""),
      isBot: /bot|crawler|spider/i.test(userAgent || ""),
    },
  };

  return next();
};
