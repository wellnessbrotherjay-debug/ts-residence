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
    const requestId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const ip = getClientIp(req);
    const geo = getRequestGeo(req);
    const cookies = parseCookies(req);
    const latestUtmCookie = parseJsonCookie<Record<string, string>>(cookies.utm_latest);

    const {
      sessionId,
      visitorId,
      eventType,
      eventCategory,
      page,
      pageTitle,
      source,
      medium,
      campaign,
      term,
      content,
      referrer,
      referrerDomain,
      gclid,
      fbclid,
      ttclid,
      msclkid,
      country,
      region,
      city,
      timezone,
      deviceType,
      deviceInfo,
      browserInfo,
      osInfo,
      screenResolution,
      language,
      elementType,
      elementText,
      elementId,
      elementClass,
      elementSelector,
      linkUrl,
      scrollDepth,
      formName,
      formId,
      funnelName,
      stepName,
      stepNumber,
      value,
      currency,
      venueId,
      timeOnPage,
      metadata
    } = body;

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: "sessionId and eventType are required" }, { status: 400 });
    }

    const audienceHints = inferAudienceHints({
      country: geo.country || country,
      language,
      deviceType,
      page,
      source,
    });

    const eventRecord = {
      session_id: sessionId,
      visitor_id: visitorId || null,
      event_type: eventType,
      event_category: eventCategory || null,
      page: page || null,
      page_title: pageTitle || null,
      source: source || latestUtmCookie?.utm_source || "direct",
      medium: medium || latestUtmCookie?.utm_medium || null,
      campaign: campaign || latestUtmCookie?.utm_campaign || null,
      term: term || latestUtmCookie?.utm_term || null,
      content: content || latestUtmCookie?.utm_content || null,
      referrer: referrer || null,
      referrer_domain: referrerDomain || null,
      gclid: gclid || latestUtmCookie?.gclid || null,
      fbclid: fbclid || latestUtmCookie?.fbclid || null,
      ttclid: ttclid || latestUtmCookie?.ttclid || null,
      msclkid: msclkid || latestUtmCookie?.msclkid || null,
      country: country || geo.country || null,
      region: region || geo.region || null,
      city: city || geo.city || null,
      timezone: timezone || geo.timezone || null,
      device_type: deviceType || null,
      device_info: deviceInfo || null,
      browser_info: browserInfo || null,
      os_info: osInfo || null,
      screen_resolution: screenResolution || null,
      language: language || null,
      element_type: elementType || null,
      element_text: elementText || null,
      element_id: elementId || null,
      element_class: elementClass || null,
      element_selector: elementSelector || null,
      link_url: linkUrl || null,
      scroll_depth: scrollDepth || null,
      form_name: formName || null,
      form_id: formId || null,
      funnel_name: funnelName || null,
      step_name: stepName || null,
      step_number: stepNumber || null,
      value: value || null,
      currency: currency || null,
      venue_id: venueId || "ts_residence",
      time_on_page_seconds: timeOnPage || null,
      metadata: {
        ...(metadata || {}),
        request_id: requestId,
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
    };

    const { error } = await supabase
      .from("traffic_events")
      .insert(eventRecord);

    if (error) {
      console.error("analytics insert error", error);
      return NextResponse.json({ error: "Could not persist analytics event" }, { status: 500 });
    }

    if (eventType === "session_start") {
      const { data: existingSession } = await supabase
        .from("sessions")
        .select("session_id")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (!existingSession) {
        await supabase.from("sessions").insert({
          session_id: sessionId,
          visitor_id: visitorId || null,
          start_time: new Date().toISOString(),
          pages_visited: 1,
          engaged: false,
          converted: false,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
