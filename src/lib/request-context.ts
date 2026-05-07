type DeviceType = "mobile" | "tablet" | "desktop" | "bot" | "unknown";

function parseDeviceType(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();

  if (!ua) return "unknown";
  if (/bot|crawler|spider|facebookexternalhit|slurp|bingpreview/.test(ua)) {
    return "bot";
  }
  if (/ipad|tablet|playbook|silk/.test(ua)) {
    return "tablet";
  }
  if (/mobi|android|iphone|ipod|blackberry|phone/.test(ua)) {
    return "mobile";
  }
  if (/macintosh|windows|linux|cros/.test(ua)) {
    return "desktop";
  }

  return "unknown";
}

export function isLikelyBot(userAgent: string | null | undefined): boolean {
  const ua = (userAgent || "").toLowerCase();
  if (!ua) return false;
  return /bot|crawler|spider|facebookexternalhit|slurp|bingpreview|headless|phantom|selenium|playwright/.test(
    ua,
  );
}

export interface RequestContext {
  ip: string | null;
  userAgent: string | null;
  deviceType: DeviceType;
  country: string | null;
  region: string | null;
  city: string | null;
  latitude: string | null;
  longitude: string | null;
}

function pickHeader(request: Request, names: string[]): string | null {
  for (const name of names) {
    const value = request.headers.get(name);
    if (value && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function normalizeCountry(country: string | null): string | null {
  if (!country) return null;
  const normalized = country.trim();
  if (!normalized) return null;
  if (normalized.toLowerCase() === "xx" || normalized.toLowerCase() === "unknown") {
    return null;
  }
  return normalized.toUpperCase();
}

export function getRequestContext(request: Request): RequestContext {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0].trim() || realIp || null;

  const userAgent = request.headers.get("user-agent");

  const country = normalizeCountry(
    pickHeader(request, [
      "x-vercel-ip-country",
      "cf-ipcountry",
      "x-country-code",
      "x-country",
      "cloudfront-viewer-country",
    ]),
  );

  const region = pickHeader(request, [
    "x-vercel-ip-country-region",
    "x-region",
    "x-vercel-ip-region",
    "cloudfront-viewer-country-region",
  ]);

  const city = pickHeader(request, [
    "x-vercel-ip-city",
    "x-city",
    "x-vercel-ip-city-name",
  ]);

  const latitude = pickHeader(request, [
    "x-vercel-ip-latitude",
    "x-latitude",
  ]);

  const longitude = pickHeader(request, [
    "x-vercel-ip-longitude",
    "x-longitude",
  ]);

  return {
    ip,
    userAgent,
    deviceType: parseDeviceType(userAgent || ""),
    country,
    region,
    city,
    latitude,
    longitude,
  };
}
