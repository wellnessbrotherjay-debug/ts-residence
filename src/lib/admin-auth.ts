import { cookies, headers } from "next/headers";
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
    "TSRmk_2026!7fC9vK2"
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

/**
 * Bearer-token shared secret for server-to-server admin API calls (e.g. the
 * TSR Leads tab in the schedule-system portal at schedule.htf.solutions).
 * Set TSR_ADMIN_TOKEN in Vercel env on this project AND on schedule-system to
 * the same value.
 */
function getAdminBearerToken() {
  return normalizeSecret(process.env.TSR_ADMIN_TOKEN);
}

function constantTimeEquals(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
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
  // Path 1: server-to-server bearer token (TSR_ADMIN_TOKEN). Used by the
  // schedule-system portal proxy so staff can manage leads without leaving
  // schedule.htf.solutions. Cookie path below is still the auth used by the
  // existing /admin browser UI.
  const bearerToken = getAdminBearerToken();
  if (bearerToken) {
    const headerStore = await headers();
    const authHeader = headerStore.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const presented = authHeader.slice("Bearer ".length).trim();
      if (presented && constantTimeEquals(presented, bearerToken)) {
        return true;
      }
    }
  }

  // Path 2: HMAC-signed cookie session (existing /admin UI auth).
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

  return constantTimeEquals(signature, expectedSignature);
}

export async function requireAdminRequest() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    throw new Error("UNAUTHORIZED_ADMIN_REQUEST");
  }
}
