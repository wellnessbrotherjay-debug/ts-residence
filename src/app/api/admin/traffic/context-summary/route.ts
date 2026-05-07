import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface BucketRow {
  key: string;
  events: number;
  leads: number;
  won: number;
  visitToSaleRate: number;
  leadToSaleRate: number;
}

function normalizeBucketKey(value: unknown, fallback = "Unknown"): string {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  const lowered = raw.toLowerCase();
  if (lowered === "unknown" || lowered === "null" || lowered === "undefined") {
    return fallback;
  }
  return raw;
}

function parsePeriodDays(period: string | null): number {
  const value = Number(period || "28");
  if (!Number.isFinite(value) || value <= 0) return 28;
  return Math.min(value, 365);
}

function parseHideUnknown(value: string | null): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function toBucketRows(
  eventCounts: Record<string, number>,
  leadCounts: Record<string, number>,
  wonCounts: Record<string, number>,
  limit = 10,
): BucketRow[] {
  const keys = new Set<string>([
    ...Object.keys(eventCounts),
    ...Object.keys(leadCounts),
    ...Object.keys(wonCounts),
  ]);

  return Array.from(keys)
    .map((key) => {
      const events = eventCounts[key] || 0;
      const leads = leadCounts[key] || 0;
      const won = wonCounts[key] || 0;
      return {
        key,
        events,
        leads,
        won,
        visitToSaleRate: events > 0 ? Number(((won / events) * 100).toFixed(2)) : 0,
        leadToSaleRate: leads > 0 ? Number(((won / leads) * 100).toFixed(1)) : 0,
      };
    })
    .sort((a, b) => b.events - a.events || b.leads - a.leads || b.won - a.won)
    .slice(0, limit);
}

export async function GET(request: Request) {
  try {
    await requireAdminRequest();

    const { searchParams } = new URL(request.url);
    const periodDays = parsePeriodDays(searchParams.get("days"));
    const hideUnknown = parseHideUnknown(searchParams.get("hideUnknown"));
    const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString();

    const [trafficRes, leadsRes] = await Promise.all([
      supabaseAdmin
        .from("traffic_events")
        .select("event_type, metadata")
        .eq("event_type", "page_view")
        .gte("created_at", since)
        .neq("source", "admin")
        .neq("event_type", "dashboard_viewed")
        .limit(50000),
      supabaseAdmin
        .from("leads")
        .select("status, metadata")
        .gte("created_at", since)
        .limit(20000),
    ]);

    if (trafficRes.error) {
      return NextResponse.json({ error: "Traffic query failed", details: trafficRes.error }, { status: 500 });
    }

    if (leadsRes.error) {
      return NextResponse.json({ error: "Leads query failed", details: leadsRes.error }, { status: 500 });
    }

    const trafficRows = trafficRes.data || [];
    const leadsRows = leadsRes.data || [];

    const eventsByCountry: Record<string, number> = {};
    const eventsByDevice: Record<string, number> = {};

    for (const row of trafficRows) {
      const metadata = (row.metadata || {}) as Record<string, unknown>;
      const country = normalizeBucketKey(metadata.request_country, "Unknown");
      const device = normalizeBucketKey(metadata.request_device_type, "unknown").toLowerCase();

      eventsByCountry[country] = (eventsByCountry[country] || 0) + 1;
      eventsByDevice[device] = (eventsByDevice[device] || 0) + 1;
    }

    const leadsByCountry: Record<string, number> = {};
    const wonByCountry: Record<string, number> = {};
    const leadsByDevice: Record<string, number> = {};
    const wonByDevice: Record<string, number> = {};

    for (const row of leadsRows) {
      const metadata = (row.metadata || {}) as Record<string, unknown>;
      const country = normalizeBucketKey(metadata.request_country, "Unknown");
      const device = normalizeBucketKey(metadata.request_device_type, "unknown").toLowerCase();
      const isWon = row.status === "closed_won";

      leadsByCountry[country] = (leadsByCountry[country] || 0) + 1;
      leadsByDevice[device] = (leadsByDevice[device] || 0) + 1;

      if (isWon) {
        wonByCountry[country] = (wonByCountry[country] || 0) + 1;
        wonByDevice[device] = (wonByDevice[device] || 0) + 1;
      }
    }

    let byCountry = toBucketRows(eventsByCountry, leadsByCountry, wonByCountry);
    let byDevice = toBucketRows(eventsByDevice, leadsByDevice, wonByDevice);

    if (hideUnknown) {
      byCountry = byCountry.filter((row) => row.key.toLowerCase() !== "unknown");
      byDevice = byDevice.filter((row) => row.key.toLowerCase() !== "unknown");
    }

    return NextResponse.json({
      periodDays,
      hideUnknown,
      generatedAt: new Date().toISOString(),
      totals: {
        pageViews: trafficRows.length,
        leads: leadsRows.length,
        closedWon: leadsRows.filter((row) => row.status === "closed_won").length,
      },
      byCountry,
      byDevice,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Failed to build context summary", details: String(err) }, { status: 500 });
  }
}
