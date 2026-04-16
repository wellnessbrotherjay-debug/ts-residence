import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import {
  anonymizeIp,
  getClientIp,
  getRequestGeo,
  inferAudienceHints,
  parseCookies,
  parseJsonCookie,
} from "@/lib/analytics-enrichment";

export async function POST(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { events } = body;
    const ip = getClientIp(req);
    const geo = getRequestGeo(req);
    const cookies = parseCookies(req);
    const latestUtmCookie = parseJsonCookie<Record<string, string>>(cookies.utm_latest);

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "events array is required" }, { status: 400 });
    }

    // Prepare events for insertion
    const eventsToInsert = events.map((event: any, index: number) => {
      const audienceHints = inferAudienceHints({
        country: geo.country || event.country,
        language: event.language,
        deviceType: event.deviceType,
        page: event.page,
        source: event.source,
      });

      return {
      session_id: event.sessionId,
      visitor_id: event.visitorId || null,
      event_type: event.eventType,
      event_category: event.eventCategory || null,
      page: event.page || null,
      page_title: event.pageTitle || null,
      referrer: event.referrer || null,
      referrer_domain: event.referrerDomain || null,
      source: event.source || latestUtmCookie?.utm_source || "direct",
      medium: event.medium || latestUtmCookie?.utm_medium || null,
      campaign: event.campaign || latestUtmCookie?.utm_campaign || null,
      term: event.term || latestUtmCookie?.utm_term || null,
      content: event.content || latestUtmCookie?.utm_content || null,
      gclid: event.gclid || latestUtmCookie?.gclid || null,
      fbclid: event.fbclid || latestUtmCookie?.fbclid || null,
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
      country: event.country || geo.country || null,
      region: event.region || geo.region || null,
      city: event.city || geo.city || null,
      timezone: event.timezone || geo.timezone || null,
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
      metadata: {
        ...(event.metadata || {}),
        request_id: `batch_${Date.now()}_${index}`,
        ip_address: ip,
        ip_anonymized: anonymizeIp(ip),
        geo_ip: geo,
        cookies_detected: {
          consent_preference: cookies.consent_preference || null,
          cookie_consent: cookies.cookie_consent || null,
          has_utm_latest: !!cookies.utm_latest,
          has_utm_first: !!cookies.utm_first,
        },
        audience_hints: audienceHints,
      },
    }});

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
