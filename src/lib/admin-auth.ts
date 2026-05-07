import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "ts_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

function normalizeSecret(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function getAdminPassword() {
  return (
    normalizeSecret(process.env.ADMIN_PASSWORD) ||
    normalizeSecret(process.env.TS_ADMIN_PASSWORD) ||
    null
  );
}

function getAdminSessionSecret() {
  return (
    normalizeSecret(process.env.ADMIN_SESSION_SECRET) ||
    normalizeSecret(process.env.ADMIN_PASSWORD) ||
    normalizeSecret(process.env.TS_ADMIN_PASSWORD) ||
    null
  );
}

function signAdminSession(payload: string) {
  const secret = getAdminSessionSecret();
  if (!secret) {
    return null;
  }

  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function isConfiguredAdminPassword(password: string) {
  const configuredPassword = getAdminPassword();
  return Boolean(configuredPassword && password.trim() === configuredPassword);
}

export function createAdminSessionValue() {
  const payload = String(Date.now());
  const signature = signAdminSession(payload);

  if (!signature) {
    return null;
  }

  return `${payload}.${signature}`;
}

export async function setAdminSessionCookie() {
  const sessionValue = createAdminSessionValue();
  if (!sessionValue) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return true;
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!cookieValue) {
    return false;
  }

  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = signAdminSession(payload);
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

export async function requireAdminRequest() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    throw new Error("UNAUTHORIZED_ADMIN_REQUEST");
  }
}
