import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";

function normalize(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function getGa4Status() {
  const propertyId = normalize(process.env.GA4_PROPERTY_ID);
  const oauthClientId = normalize(process.env.GA4_OAUTH_CLIENT_ID);
  const oauthClientSecret = normalize(process.env.GA4_OAUTH_CLIENT_SECRET);
  const oauthRefreshToken = normalize(process.env.GA4_OAUTH_REFRESH_TOKEN);
  const serviceAccountEmail = normalize(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  const serviceAccountPrivateKey = normalize(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
  const serviceAccountJson = normalize(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

  const hasOauth = Boolean(oauthClientId && oauthClientSecret && oauthRefreshToken);
  const hasServiceAccount = Boolean(
    serviceAccountJson || (serviceAccountEmail && serviceAccountPrivateKey),
  );

  const connected = Boolean(propertyId && (hasOauth || hasServiceAccount));
  const url = propertyId
    ? `https://analytics.google.com/analytics/web/#/p${propertyId}/reports/intelligenthome`
    : "https://analytics.google.com/analytics/web/";

  return {
    connected,
    label: connected ? "Connected" : "Not Connected",
    url,
  };
}

function getMetaStatus() {
  const pixelId =
    normalize(process.env.NEXT_PUBLIC_META_PIXEL_ID) ||
    normalize(process.env.next_PUBLIC_META_PIXEL_ID) ||
    normalize(process.env.META_PIXEL_ID);

  const connected = Boolean(pixelId);
  const url = pixelId
    ? `https://business.facebook.com/events_manager2/list/pixel/${pixelId}`
    : "https://business.facebook.com/events_manager2";

  return {
    connected,
    label: connected ? "Connected" : "Not Connected",
    url,
  };
}

export async function GET() {
  try {
    await requireAdminRequest();

    return NextResponse.json({
      ga4: getGa4Status(),
      meta: getMetaStatus(),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Failed to load integration status" }, { status: 500 });
  }
}
