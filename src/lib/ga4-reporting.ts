import { JWT, OAuth2Client } from "google-auth-library";

interface Ga4MetricValue {
  value: string;
}

interface Ga4DimensionValue {
  value: string;
}

interface Ga4Row {
  dimensionValues?: Ga4DimensionValue[];
  metricValues?: Ga4MetricValue[];
}

interface RunReportResponse {
  rows?: Ga4Row[];
}

function getGa4Credentials() {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (json) {
    const parsed = JSON.parse(json);
    return {
      clientEmail: parsed.client_email as string | undefined,
      privateKey: parsed.private_key as string | undefined,
    };
  }

  return {
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    ),
  };
}

function getGa4OAuthCredentials() {
  return {
    clientId: process.env.GA4_OAUTH_CLIENT_ID?.trim(),
    clientSecret: process.env.GA4_OAUTH_CLIENT_SECRET?.trim(),
    refreshToken: process.env.GA4_OAUTH_REFRESH_TOKEN?.trim(),
  };
}

async function getGa4AccessToken() {
  const { clientId, clientSecret, refreshToken } = getGa4OAuthCredentials();
  if (clientId && clientSecret && refreshToken) {
    const auth = new OAuth2Client(clientId, clientSecret);
    auth.setCredentials({ refresh_token: refreshToken });

    const token = await auth.getAccessToken();
    if (token.token) {
      return token.token;
    }
  }

  const { clientEmail, privateKey } = getGa4Credentials();
  if (!clientEmail || !privateKey) {
    return null;
  }

  const auth = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });
  const token = await auth.authorize();
  return token.access_token || null;
}

async function runGa4Report(body: Record<string, unknown>) {
  const propertyId = process.env.GA4_PROPERTY_ID?.trim();
  const accessToken = await getGa4AccessToken();
  if (!propertyId || !accessToken) {
    return null;
  }

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GA4 report failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as RunReportResponse;
}

function toNumber(value?: string) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatGaDate(value: string) {
  if (value.length !== 8) {
    return value;
  }

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function getAllowedGaHostnames() {
  const configuredUrl = process.env.GA_STREAM_URL?.trim();
  const configuredHost = configuredUrl
    ? (() => {
        try {
          return new URL(configuredUrl).hostname;
        } catch {
          return null;
        }
      })()
    : null;

  return Array.from(
    new Set(
      [configuredHost, "www.tsresidence.id", "tsresidence.id", "localhost"]
        .filter((value): value is string => Boolean(value))
        .map((value) => value.toLowerCase()),
    ),
  );
}

function buildHostnameDimensionFilter() {
  const expressions = getAllowedGaHostnames().map((value) => ({
    filter: {
      fieldName: "hostName",
      stringFilter: {
        matchType: "EXACT",
        value,
        caseSensitive: false,
      },
    },
  }));

  if (expressions.length === 0) {
    return undefined;
  }

  return expressions.length === 1
    ? expressions[0]
    : {
        orGroup: {
          expressions,
        },
      };
}

function isAllowedGaHostname(value?: string) {
  if (!value) {
    return false;
  }

  return getAllowedGaHostnames().includes(value.toLowerCase());
}

function getExcludedGaPageKeywords() {
  const configuredKeywords = process.env.GA4_EXCLUDED_PAGE_KEYWORDS
    ?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(
    new Set(["archon", "archon protection", ...(configuredKeywords || [])]),
  );
}

function isExcludedGaPage(title?: string, path?: string) {
  const haystack = `${title || ""} ${path || ""}`.toLowerCase();
  return getExcludedGaPageKeywords().some((keyword) => haystack.includes(keyword));
}

function sortByMetricDesc<T extends { activeUsers?: number; views?: number }>(
  left: T,
  right: T,
) {
  const leftValue = left.activeUsers ?? left.views ?? 0;
  const rightValue = right.activeUsers ?? right.views ?? 0;
  return rightValue - leftValue;
}

export async function getGa4MarketingSummary() {
  const hostnameFilter = buildHostnameDimensionFilter();
  const [totalsReport, trendReport, topPagesReport, sourceReport] = await Promise.all([
    runGa4Report({
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      dimensions: [{ name: "hostName" }],
      metrics: [
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "averageSessionDuration" },
        { name: "eventCount" },
      ],
      dimensionFilter: hostnameFilter,
    }),
    runGa4Report({
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }, { name: "hostName" }],
      metrics: [
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "eventCount" },
      ],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      dimensionFilter: hostnameFilter,
    }),
    runGa4Report({
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      dimensions: [
        { name: "hostName" },
        { name: "pagePathPlusQueryString" },
        { name: "pageTitle" },
      ],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      dimensionFilter: hostnameFilter,
      limit: 20,
    }),
    runGa4Report({
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      dimensions: [
        { name: "hostName" },
        { name: "sessionSource" },
        { name: "sessionMedium" },
        { name: "sessionCampaignName" },
      ],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      dimensionFilter: hostnameFilter,
      limit: 8,
    }),
  ]);

  if (!totalsReport || !trendReport || !topPagesReport || !sourceReport) {
    return null;
  }

  const totalsRow = totalsReport.rows?.[0];
  const metricValues = totalsRow?.metricValues || [];

  const trendsByDate = new Map<
    string,
    { date: string; activeUsers: number; newUsers: number; eventCount: number }
  >();

  for (const row of trendReport.rows || []) {
    const hostname = row.dimensionValues?.[1]?.value;
    if (!isAllowedGaHostname(hostname)) {
      continue;
    }

    const date = formatGaDate(row.dimensionValues?.[0]?.value || "");
    const existing = trendsByDate.get(date) || {
      date,
      activeUsers: 0,
      newUsers: 0,
      eventCount: 0,
    };

    existing.activeUsers += toNumber(row.metricValues?.[0]?.value);
    existing.newUsers += toNumber(row.metricValues?.[1]?.value);
    existing.eventCount += toNumber(row.metricValues?.[2]?.value);

    trendsByDate.set(date, existing);
  }

  const pagesByKey = new Map<string, { path: string; title: string; views: number }>();

  for (const row of topPagesReport.rows || []) {
    const hostname = row.dimensionValues?.[0]?.value;
    const path = row.dimensionValues?.[1]?.value || "/";
    const title = row.dimensionValues?.[2]?.value || "Untitled";

    if (!isAllowedGaHostname(hostname) || isExcludedGaPage(title, path)) {
      continue;
    }

    const key = `${path}__${title}`;
    const existing = pagesByKey.get(key) || { path, title, views: 0 };
    existing.views += toNumber(row.metricValues?.[0]?.value);
    pagesByKey.set(key, existing);
  }

  const sourcesByKey = new Map<
    string,
    { source: string; medium: string; campaign: string; activeUsers: number }
  >();

  for (const row of sourceReport.rows || []) {
    const hostname = row.dimensionValues?.[0]?.value;
    if (!isAllowedGaHostname(hostname)) {
      continue;
    }

    const source = row.dimensionValues?.[1]?.value || "(direct)";
    const medium = row.dimensionValues?.[2]?.value || "(none)";
    const campaign = row.dimensionValues?.[3]?.value || "(not set)";
    const key = `${source}__${medium}__${campaign}`;
    const existing = sourcesByKey.get(key) || {
      source,
      medium,
      campaign,
      activeUsers: 0,
    };

    existing.activeUsers += toNumber(row.metricValues?.[0]?.value);
    sourcesByKey.set(key, existing);
  }

  return {
    totals: {
      activeUsers: toNumber(metricValues[0]?.value),
      newUsers: toNumber(metricValues[1]?.value),
      averageSessionDuration: toNumber(metricValues[2]?.value),
      eventCount: toNumber(metricValues[3]?.value),
    },
    trends: Array.from(trendsByDate.values()).sort((left, right) =>
      left.date.localeCompare(right.date),
    ),
    topPages: Array.from(pagesByKey.values()).sort(sortByMetricDesc).slice(0, 8),
    sources: Array.from(sourcesByKey.values()).sort(sortByMetricDesc),
  };
}

// Simpler GA4 fetch for a configurable period (used by report emails)
export async function getGa4ReportForPeriod(startDate: string) {
  const hostnameFilter = buildHostnameDimensionFilter();

  const [totalsReport, sourceReport, topPagesReport] = await Promise.all([
    runGa4Report({
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "hostName" }],
      metrics: [
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "sessions" },
        { name: "averageSessionDuration" },
        { name: "eventCount" },
      ],
      dimensionFilter: hostnameFilter,
    }),
    runGa4Report({
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [
        { name: "hostName" },
        { name: "sessionSource" },
        { name: "sessionMedium" },
        { name: "sessionCampaignName" },
      ],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      dimensionFilter: hostnameFilter,
      limit: 10,
    }),
    runGa4Report({
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [
        { name: "hostName" },
        { name: "pagePathPlusQueryString" },
        { name: "pageTitle" },
      ],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      dimensionFilter: hostnameFilter,
      limit: 5,
    }),
  ]);

  if (!totalsReport) return null;

  const metricValues = totalsReport.rows?.[0]?.metricValues || [];

  const sources: { source: string; medium: string; campaign: string; activeUsers: number }[] = [];
  for (const row of sourceReport?.rows || []) {
    const hostname = row.dimensionValues?.[0]?.value;
    if (!isAllowedGaHostname(hostname)) continue;
    sources.push({
      source: row.dimensionValues?.[1]?.value || "(direct)",
      medium: row.dimensionValues?.[2]?.value || "(none)",
      campaign: row.dimensionValues?.[3]?.value || "(not set)",
      activeUsers: toNumber(row.metricValues?.[0]?.value),
    });
  }

  const topPages: { path: string; title: string; views: number }[] = [];
  for (const row of topPagesReport?.rows || []) {
    const hostname = row.dimensionValues?.[0]?.value;
    const path = row.dimensionValues?.[1]?.value || "/";
    const title = row.dimensionValues?.[2]?.value || "Untitled";
    if (!isAllowedGaHostname(hostname) || isExcludedGaPage(title, path)) continue;
    topPages.push({ path, title, views: toNumber(row.metricValues?.[0]?.value) });
  }

  return {
    activeUsers: toNumber(metricValues[0]?.value),
    newUsers: toNumber(metricValues[1]?.value),
    sessions: toNumber(metricValues[2]?.value),
    avgSessionDuration: toNumber(metricValues[3]?.value),
    eventCount: toNumber(metricValues[4]?.value),
    sources,
    topPages,
  };
}
