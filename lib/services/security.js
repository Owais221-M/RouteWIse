const cityPattern = /^[\p{L}\p{M}\s.'-]{2,60}$/u;
const routePattern = /^[\p{L}\p{M}\s.'\\-]+(?:\s→\s[\p{L}\p{M}\s.'\\-]+)+$/u;
const allowedTypes = new Set(["train", "bus", "mixed"]);
const requestBuckets = new Map();

// Prune expired rate-limit entries every 5 minutes to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of requestBuckets.entries()) {
    if (now > bucket.resetAt) requestBuckets.delete(key);
  }
}, 5 * 60_000);

// Typed error for clean status mapping — avoids fragile string matching
export class HttpError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

export function sanitizeCity(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

export function validateSearchInput(body) {
  const origin = sanitizeCity(body?.origin);
  const destination = sanitizeCity(body?.destination);
  const date = typeof body?.date === "string" ? body.date.trim() : "";

  if (!cityPattern.test(origin) || !cityPattern.test(destination)) {
    throw new HttpError("Origin and destination must be valid city names", 400);
  }

  if (origin.toLowerCase() === destination.toLowerCase()) {
    throw new HttpError("Origin and destination must be different", 400);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw new HttpError("Date must use YYYY-MM-DD format", 400);
  }

  return { origin, destination, date };
}

export function validateCheckoutInput(body) {
  const search = validateSearchInput(body);
  const route = typeof body?.route === "string" ? body.route.trim().replace(/\s+/g, " ") : "";
  const type = typeof body?.type === "string" ? body.type.trim() : "";

  if (!routePattern.test(route)) {
    throw new HttpError("Route format is invalid", 400);
  }

  if (!allowedTypes.has(type)) {
    throw new HttpError("Transport type is invalid", 400);
  }

  return { ...search, route, type };
}

export function rateLimit(req, { limit = 30, windowMs = 60_000 } = {}) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(",")[0]?.trim() ?? req.socket?.remoteAddress ?? "unknown";
  const key = `${ip}:${req.url}`;
  const now = Date.now();
  const bucket = requestBuckets.get(key) ?? { count: 0, resetAt: now + windowMs };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  requestBuckets.set(key, bucket);

  if (bucket.count > limit) {
    throw new HttpError("Too many requests. Please wait a moment and try again.", 429);
  }
}

export function safeErrorResponse(res, error) {
  // Use typed status from HttpError, or default to 500
  const status = error instanceof HttpError ? error.status : 500;
  // Never leak internal error messages for server errors
  const message = status === 500 ? "Internal Server Error" : error.message;
  return res.status(status).json({ error: message });
}
