import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const HASH_PREFIX = "scrypt";

export function normalizeMarketingUsername(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

export function hashMarketingPassword(password: string): string {
  const normalized = password.trim();
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(normalized, salt, 64).toString("hex");
  return `${HASH_PREFIX}$${salt}$${hash}`;
}

export function verifyMarketingPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split("$");
  if (parts.length !== 3) {
    return false;
  }

  const [prefix, salt, hash] = parts;
  if (prefix !== HASH_PREFIX || !salt || !hash) {
    return false;
  }

  const derivedHash = scryptSync(password.trim(), salt, 64);
  const savedHash = Buffer.from(hash, "hex");

  if (derivedHash.length !== savedHash.length) {
    return false;
  }

  return timingSafeEqual(derivedHash, savedHash);
}
