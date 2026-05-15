import { NextResponse } from "next/server";
import { requireUtmBuilderRequest } from "@/lib/utm-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    await requireUtmBuilderRequest();

    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand") || "ts-residence";

    // Get all generated links for this brand
    const { data: links, error: linksError } = await supabaseAdmin
      .from("generated_tracking_links")
      .select("*")
      .eq("brand", brand)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (linksError) throw linksError;

    if (!links || links.length === 0) {
      return NextResponse.json([]);
    }

    // For each link, count traffic events that match the utm_campaign
    const performance = await Promise.all(
      links.map(async (link) => {
        // Count total traffic events for this campaign
        const { count: totalVisits } = await supabaseAdmin
          .from("traffic_events")
          .select("*", { count: "exact", head: true })
          .eq("campaign", link.utm_campaign);

        // Count booking_intent events (CTA clicks) for this campaign
        const { count: ctaClicks } = await supabaseAdmin
          .from("traffic_events")
          .select("*", { count: "exact", head: true })
          .eq("campaign", link.utm_campaign)
          .eq("event_type", "booking_intent");

        // Count leads that came from this campaign
        const { count: leadsGenerated } = await supabaseAdmin
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("first_campaign", link.utm_campaign);

        return {
          id: link.id,
          created_at: link.created_at,
          campaign_name: link.campaign_name,
          note_title: link.note_title,
          utm_campaign: link.utm_campaign,
          utm_source: link.utm_source,
          utm_medium: link.utm_medium,
          generated_url: link.generated_url,
          total_visits: totalVisits || 0,
          cta_clicks: ctaClicks || 0,
          leads_generated: leadsGenerated || 0,
          conversion_rate: totalVisits ? ((ctaClicks || 0) / totalVisits * 100).toFixed(2) + "%" : "0%",
        };
      })
    );

    // Sort by visits descending
    const sorted = performance.sort((a, b) => b.total_visits - a.total_visits);

    return NextResponse.json(sorted);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_UTM_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("generated-links-performance error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
