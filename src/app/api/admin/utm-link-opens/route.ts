import { NextResponse } from "next/server";
import { requireUtmBuilderRequest } from "@/lib/utm-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

function toNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function GET(request: Request) {
  try {
    await requireUtmBuilderRequest();

    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get("linkId");
    const brand = searchParams.get("brand") || "ts-residence";

    if (!linkId) {
      return NextResponse.json({ error: "linkId is required" }, { status: 400 });
    }

    const { data: link, error: linkError } = await supabaseAdmin
      .from("generated_tracking_links")
      .select("id, generated_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term")
      .eq("id", linkId)
      .eq("brand", brand)
      .single();

    if (linkError || !link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    let query = supabaseAdmin
      .from("traffic_events")
      .select("id, created_at, event_type, page, source, medium, campaign, content, term, session_id, visitor_id, referrer, metadata")
      .eq("event_type", "page_view")
      .eq("campaign", link.utm_campaign)
      .eq("source", link.utm_source)
      .eq("medium", link.utm_medium)
      .order("created_at", { ascending: false })
      .limit(200);

    const content = toNullableString(link.utm_content);
    const term = toNullableString(link.utm_term);

    if (content) {
      query = query.eq("content", content);
    }

    if (term) {
      query = query.eq("term", term);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return NextResponse.json({
      link,
      opens: data || [],
    });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_UTM_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("utm-link-opens GET error", err);
    return NextResponse.json({ error: "Could not load UTM open history" }, { status: 500 });
  }
}
