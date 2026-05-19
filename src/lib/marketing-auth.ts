import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const MARKETING_SESSION_COOKIE = "ts_marketing_session";
const MARKETING_SESSION_MAX_AGE = 60 * 60 * 12;

export interface MarketingSession {
  authenticated: boolean;
  userName: string | null;
}

function normalizeSecret(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function getMarketingPassword() {
  return (
    normalizeSecret(process.env.MARKETING_PASSWORD) ||
    normalizeSecret(process.env.TS_MARKETING_PASSWORD) ||
    "ts-marketing"
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

export function isMarketingPasswordConfigured() {
  return Boolean(getMarketingPassword());
}

export function createMarketingSessionValue(userName?: string | null) {
  const safeUser = userName?.trim().replace(/[^a-zA-Z0-9 _.-]/g, "") || "marketing-team";
  const payload = `${Date.now()}:${safeUser}`;
  const signature = signMarketingSession(payload);

  if (!signature) {
    return null;
  }

  return `${payload}.${signature}`;
}

export async function setMarketingSessionCookie(userName?: string | null) {
  const sessionValue = createMarketingSessionValue(userName);
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

function extractUserNameFromPayload(payload: string): string | null {
  const [timestampMaybe, ...rest] = payload.split(":");
  if (!timestampMaybe || !/^\d+$/.test(timestampMaybe)) {
    return null;
  }
  const userRaw = rest.join(":").trim();
  return userRaw || "marketing-team";
}

export async function getMarketingSession(): Promise<MarketingSession> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(MARKETING_SESSION_COOKIE)?.value;
  if (!cookieValue) {
    return { authenticated: false, userName: null };
  }

  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) {
    return { authenticated: false, userName: null };
  }

  const expectedSignature = signMarketingSession(payload);
  if (!expectedSignature) {
    return { authenticated: false, userName: null };
  }

  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (actualBuffer.length !== expectedBuffer.length) {
    return { authenticated: false, userName: null };
  }

  const authenticated = timingSafeEqual(actualBuffer, expectedBuffer);
  if (!authenticated) {
    return { authenticated: false, userName: null };
  }

  return {
    authenticated: true,
    userName: extractUserNameFromPayload(payload),
  };
}

export async function isMarketingAuthenticated() {
  const session = await getMarketingSession();
  return session.authenticated;
}

export async function requireMarketingRequest() {
  const authenticated = await isMarketingAuthenticated();
  if (!authenticated) {
    throw new Error("UNAUTHORIZED_MARKETING_REQUEST");
  }
}
