import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getMarketingSession } from "@/lib/marketing-auth";
import { requireUtmBuilderRequest } from "@/lib/utm-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { appendUtmLogToObsidian } from "@/lib/obsidian-logs";

function getErrorMessage(err: unknown) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;

  if (typeof err === "object") {
    const maybe = err as {
      message?: unknown;
      details?: unknown;
      hint?: unknown;
      code?: unknown;
    };

    const parts = [
      typeof maybe.message === "string" ? maybe.message : null,
      typeof maybe.details === "string" ? maybe.details : null,
      typeof maybe.hint === "string" ? `Hint: ${maybe.hint}` : null,
      typeof maybe.code === "string" ? `Code: ${maybe.code}` : null,
    ].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(" | ");
    }
  }

  return "Unexpected server error";
}

export async function GET(request: Request) {
  try {
    await requireUtmBuilderRequest();

    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand") || "ts-residence";
    const createdBy = searchParams.get("createdBy")?.trim();
    const source = searchParams.get("source")?.trim();
    const medium = searchParams.get("medium")?.trim();
    const campaign = searchParams.get("campaign")?.trim();
    const search = searchParams.get("search")?.trim();
    const from = searchParams.get("from")?.trim();
    const to = searchParams.get("to")?.trim();

    const parsedLimit = Number(searchParams.get("limit") || "500");
    const limit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(Math.floor(parsedLimit), 1), 2000)
      : 500;

    let query = supabaseAdmin
      .from("generated_tracking_links")
      .select("*")
      .eq("brand", brand)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (createdBy) {
      query = query.ilike("created_by", `%${createdBy}%`);
    }

    if (source) {
      query = query.eq("utm_source", source);
    }

    if (medium) {
      query = query.eq("utm_medium", medium);
    }

    if (campaign) {
      query = query.ilike("utm_campaign", `%${campaign}%`);
    }

    if (from) {
      const fromIso = `${from}T00:00:00.000Z`;
      query = query.gte("created_at", fromIso);
    }

    if (to) {
      const toIso = `${to}T23:59:59.999Z`;
      query = query.lte("created_at", toIso);
    }

    if (search) {
      const safeSearch = search.replace(/,/g, " ").trim();
      if (safeSearch) {
        query = query.or([
          `note_title.ilike.%${safeSearch}%`,
          `generated_url.ilike.%${safeSearch}%`,
          `utm_campaign.ilike.%${safeSearch}%`,
          `utm_content.ilike.%${safeSearch}%`,
          `utm_term.ilike.%${safeSearch}%`,
          `created_by.ilike.%${safeSearch}%`,
        ].join(","));
      }
    }

    const { data, error } = await query;

    if (error) {
      // Table may not exist yet — return empty rather than 500
      if (String(error.code) === "42P01") {
        return NextResponse.json([]);
      }
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_UTM_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("utm-links GET error", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    await requireUtmBuilderRequest();

    const body = await request.json();
    const {
      name,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      full_url,
      created_by,
      brand = "ts-residence",
    } = body;

    if (!full_url) {
      return NextResponse.json({ error: "full_url is required" }, { status: 400 });
    }

    if (!utm_campaign || !String(utm_campaign).trim()) {
      return NextResponse.json({ error: "utm_campaign is required" }, { status: 400 });
    }

    if (!created_by || !String(created_by).trim()) {
      return NextResponse.json({ error: "created_by is required" }, { status: 400 });
    }

    const [adminAuthenticated, marketingSession] = await Promise.all([
      isAdminAuthenticated(),
      getMarketingSession(),
    ]);

    let createdBy = typeof created_by === "string" && created_by.trim() ? created_by.trim() : "team";
    if (!adminAuthenticated && marketingSession.authenticated && marketingSession.userName) {
      // Marketing sessions always write their profile name for a trustworthy audit trail.
      createdBy = marketingSession.userName;
    }

    // Map UtmBuilder's "name" field to "note_title", use campaign as campaign_name if not provided
    const noteTitle = name || `${utm_source} / ${utm_medium} — ${utm_campaign}`;
    const campaignName = utm_campaign || "unknown";

    const { data, error } = await supabaseAdmin
      .from("generated_tracking_links")
      .insert([{
        brand,
        campaign_name: campaignName,
        note_title: noteTitle,
        generated_url: full_url,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content: utm_content || null,
        utm_term: utm_term || null,
        created_by: createdBy,
        is_active: true
      }])
      .select("*")
      .single();

    if (error) {
      if (String(error.code) === "42P01") {
        return NextResponse.json(
          { error: "generated_tracking_links table not found. Create it in Supabase SQL Editor first." },
          { status: 503 },
        );
      }
      throw error;
    }

    try {
      await appendUtmLogToObsidian({
        createdAt: data.created_at,
        createdBy,
        noteTitle,
        generatedUrl: full_url,
        utmSource: utm_source,
        utmMedium: utm_medium,
        utmCampaign: utm_campaign,
        utmContent: utm_content,
        utmTerm: utm_term,
        brand,
      });
    } catch (obsidianError) {
      console.warn("utm-links POST obsidian log warning", obsidianError);
    }

    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_UTM_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("utm-links POST error", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
