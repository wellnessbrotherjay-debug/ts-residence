import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const MARKETING_SESSION_COOKIE = "ts_marketing_session";
const MARKETING_SESSION_MAX_AGE = 60 * 60 * 12;
const DEFAULT_MARKETING_PASSWORD = "tsrmarketing2026";

function normalizeSecret(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function getMarketingPassword() {
  return (
    normalizeSecret(process.env.MARKETING_PASSWORD) ||
    normalizeSecret(process.env.TS_MARKETING_PASSWORD) ||
    DEFAULT_MARKETING_PASSWORD
  );
}

function getMarketingSessionSecret() {
  return (
    normalizeSecret(process.env.MARKETING_SESSION_SECRET) ||
    normalizeSecret(process.env.ADMIN_SESSION_SECRET) ||
    normalizeSecret(process.env.MARKETING_PASSWORD) ||
    normalizeSecret(process.env.TS_MARKETING_PASSWORD) ||
    normalizeSecret(process.env.ADMIN_PASSWORD) ||
    normalizeSecret(process.env.TS_ADMIN_PASSWORD) ||
    null
  );
}

function signMarketingSession(payload: string) {
  const secret = getMarketingSessionSecret();
  if (!secret) {
    return null;
  }

  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function isConfiguredMarketingPassword(password: string) {
  const configuredPassword = getMarketingPassword();
  return Boolean(configuredPassword && password.trim() === configuredPassword);
}

export function createMarketingSessionValue() {
  const payload = String(Date.now());
  const signature = signMarketingSession(payload);

  if (!signature) {
    return null;
  }

  return `${payload}.${signature}`;
}

export async function setMarketingSessionCookie() {
  const sessionValue = createMarketingSessionValue();
  if (!sessionValue) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(MARKETING_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MARKETING_SESSION_MAX_AGE,
  });

  return true;
}

export async function clearMarketingSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(MARKETING_SESSION_COOKIE);
}

export async function isMarketingAuthenticated() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(MARKETING_SESSION_COOKIE)?.value;
  if (!cookieValue) {
    return false;
  }

  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = signMarketingSession(payload);
  if (!expectedSignature) {
    return false;
  }

  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function requireMarketingRequest() {
  const authenticated = await isMarketingAuthenticated();
  if (!authenticated) {
    throw new Error("UNAUTHORIZED_MARKETING_REQUEST");
  }
}
