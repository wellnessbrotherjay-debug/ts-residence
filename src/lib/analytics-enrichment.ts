export type RequestGeo = {
  country?: string | null;
  region?: string | null;
  city?: string | null;
  timezone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

function firstNonEmpty(...values: Array<string | null | undefined>) {
  for (const v of values) {
    if (v && v.trim()) return v.trim();
  }
  return null;
}

export function getClientIp(req: Request): string | null {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  const forwardedIp = xForwardedFor?.split(",")[0]?.trim();

  return firstNonEmpty(
    req.headers.get("x-real-ip"),
    req.headers.get("cf-connecting-ip"),
    req.headers.get("x-client-ip"),
    req.headers.get("x-forwarded"),
    req.headers.get("forwarded"),
    req.headers.get("x-cluster-client-ip"),
    req.headers.get("fastly-client-ip"),
    req.headers.get("true-client-ip"),
    req.headers.get("x-appengine-user-ip"),
    forwardedIp,
  );
}

export function anonymizeIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  if (ip.includes(":")) {
    const parts = ip.split(":").filter(Boolean);
    return parts.slice(0, 4).join(":") + "::";
  }
  return ip;
}

export function getRequestGeo(req: Request): RequestGeo {
  const latitudeRaw = req.headers.get("x-vercel-ip-latitude");
  const longitudeRaw = req.headers.get("x-vercel-ip-longitude");

  return {
    country: firstNonEmpty(req.headers.get("x-vercel-ip-country"), req.headers.get("cf-ipcountry")),
    region: firstNonEmpty(req.headers.get("x-vercel-ip-country-region"), req.headers.get("x-vercel-ip-region")),
    city: firstNonEmpty(req.headers.get("x-vercel-ip-city")),
    timezone: firstNonEmpty(req.headers.get("x-vercel-ip-timezone")),
    latitude: latitudeRaw ? Number(latitudeRaw) : null,
    longitude: longitudeRaw ? Number(longitudeRaw) : null,
  };
}

export function parseCookies(req: Request): Record<string, string> {
  const cookieHeader = req.headers.get("cookie") || "";
  const result: Record<string, string> = {};

  cookieHeader.split(";").forEach((part) => {
    const [k, ...rest] = part.trim().split("=");
    if (!k) return;
    result[k] = decodeURIComponent(rest.join("=") || "");
  });

  return result;
}

export function parseJsonCookie<T = Record<string, any>>(value: string | undefined): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function inferAudienceHints(input: {
  country?: string | null;
  language?: string | null;
  deviceType?: string | null;
  page?: string | null;
  source?: string | null;
}) {
  const country = (input.country || "").toUpperCase();
  const language = (input.language || "").toLowerCase();
  const page = (input.page || "").toLowerCase();

  const visitorContext: string[] = [];

  if (page.includes("apartment")) visitorContext.push("apartment_interest");
  if (page.includes("offer")) visitorContext.push("deal_sensitive");
  if (page.includes("gallery")) visitorContext.push("visual_explorer");
  if (page.includes("healthy") || page.includes("wellness")) visitorContext.push("wellness_interest");
  if (page.includes("contact")) visitorContext.push("high_intent_contact");

  if (language.startsWith("id")) visitorContext.push("bahasa_speaker");
  else if (language.startsWith("en")) visitorContext.push("english_speaker");

  if (country && country !== "ID") visitorContext.push("international_visitor");
  if (country === "ID") visitorContext.push("domestic_visitor");

  return {
    visitor_context: visitorContext,
    source_hint: input.source || "direct",
    device_profile: input.deviceType || "unknown",
  };
}
