import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { events } = body;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "events array is required" }, { status: 400 });
    }

    // Prepare events for insertion
    const eventsToInsert = events.map((event: any) => ({
      session_id: event.sessionId,
      visitor_id: event.visitorId || null,
      event_type: event.eventType,
      event_category: event.eventCategory || null,
      page: event.page || null,
      page_title: event.pageTitle || null,
      referrer: event.referrer || null,
      referrer_domain: event.referrerDomain || null,
      source: event.source || "direct",
      medium: event.medium || null,
      campaign: event.campaign || null,
      term: event.term || null,
      content: event.content || null,
      gclid: event.gclid || null,
      fbclid: event.fbclid || null,
      ttclid: event.ttclid || null,
      msclkid: event.msclkid || null,
      // Click-specific
      element_type: event.elementType || null,
      element_text: event.elementText || null,
      element_id: event.elementId || null,
      element_class: event.elementClass || null,
      element_selector: event.elementSelector || null,
      link_url: event.linkUrl || null,
      // Scroll-specific
      scroll_depth: event.scrollDepth || null,
      // Time-specific
      time_on_page_seconds: event.timeOnPage || null,
      // Form-specific
      form_name: event.formName || null,
      form_id: event.formId || null,
      // Funnel-specific
      funnel_name: event.funnelName || null,
      step_name: event.stepName || null,
      step_number: event.stepNumber || null,
      value: event.value || null,
      currency: event.currency || null,
      // Location
      country: event.country || null,
      region: event.region || null,
      city: event.city || null,
      timezone: event.timezone || null,
      // Device
      device_type: event.deviceType || null,
      device_info: event.deviceInfo || null,
      browser_info: event.browserInfo || null,
      os_info: event.osInfo || null,
      screen_resolution: event.screenResolution || null,
      language: event.language || null,
      // Venue
      venue_id: event.venueId || 'ts_residence',
      // Metadata
      metadata: event.metadata || {},
    }));

    // Batch insert events
    const { error } = await supabase
      .from("traffic_events")
      .insert(eventsToInsert);

    if (error) {
      console.error("batch analytics insert error", error);
      return NextResponse.json({ error: "Could not persist batch analytics events" }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: events.length });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
