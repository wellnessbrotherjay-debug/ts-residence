import { NextResponse } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

const globalBuckets = globalThis as typeof globalThis & {
  __tsRateLimitBuckets?: Map<string, Bucket>;
};

const buckets = globalBuckets.__tsRateLimitBuckets || new Map<string, Bucket>();
globalBuckets.__tsRateLimitBuckets = buckets;

export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }

  return "unknown";
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    const nextBucket: Bucket = { count: 1, resetAt: now + windowMs };
    buckets.set(key, nextBucket);
    return { allowed: true, remaining: limit - 1, retryAfterMs: windowMs };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, existing.resetAt - now),
    };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    retryAfterMs: Math.max(0, existing.resetAt - now),
  };
}

export function tooManyRequestsResponse(retryAfterMs: number) {
  const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    },
  );
}
