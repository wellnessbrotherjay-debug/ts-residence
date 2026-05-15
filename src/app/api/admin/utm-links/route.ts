import { NextResponse } from "next/server";
import { requireUtmBuilderRequest } from "@/lib/utm-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    await requireUtmBuilderRequest();

    // Get brand from query param or default to "ts-residence"
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand") || "ts-residence";

    const { data, error } = await supabaseAdmin
      .from("generated_tracking_links")
      .select("id, created_at, note_title as name, generated_url as full_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term, brand, campaign_name")
      .eq("brand", brand)
      .order("created_at", { ascending: false })
      .limit(100);

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
    const { name, utm_source, utm_medium, utm_campaign, utm_content, utm_term, full_url, brand = "ts-residence" } = body;

    if (!full_url) {
      return NextResponse.json({ error: "full_url is required" }, { status: 400 });
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
        created_by: "admin-utm-builder",
        is_active: true
      }])
      .select("id, created_at, note_title as name, generated_url as full_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term")
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

    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_UTM_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("utm-links POST error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
