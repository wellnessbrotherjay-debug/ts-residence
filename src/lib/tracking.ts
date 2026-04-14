export type TrackingEventName =
  | "page_view"
  | "cta_click"
  | "social_click"
  | "nav_click"
  | "gallery_interaction"
  | "form_start"
  | "form_submit"
  | "form_error"
  | "scroll_depth"
  | "engaged_session"
  | "consent_update";

export interface TrackingParams {
  page_name?: string;
  page_path?: string;
  cta_label?: string;
  section?: string;
  component?: string;
  device_type?: "desktop" | "mobile" | "tablet" | "unknown";
  [key: string]: any;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
}

export function captureUTMs(search: string) {
  if (typeof window === "undefined" || !search) return;
  const urlParams = new URLSearchParams(search);
  
  const currentUTMs: UTMParams = {};
  let hasUTM = false;

  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "ttclid"].forEach((key) => {
    let val = urlParams.get(key);
    if (val) {
      val = val.toLowerCase().replace(/[^a-z0-9_-]/g, "_"); // Enforce lowercase snake_case pattern
      currentUTMs[key as keyof UTMParams] = val;
      hasUTM = true;
    }
  });

  if (hasUTM) {
    const latest = JSON.stringify(currentUTMs);
    localStorage.setItem("utm_latest", latest);
    
    if (!localStorage.getItem("utm_first")) {
      localStorage.setItem("utm_first", latest);
    }
    
    document.cookie = `utm_latest=${encodeURIComponent(latest)}; path=/; max-age=2592000; SameSite=Lax`;
  }
}

export function getUTMs(): { first: UTMParams; latest: UTMParams } {
  if (typeof window === "undefined") return { first: {}, latest: {} };
  
  try {
    const firstStr = localStorage.getItem("utm_first");
    const latestStr = localStorage.getItem("utm_latest");
    return {
      first: firstStr ? JSON.parse(firstStr) : {},
      latest: latestStr ? JSON.parse(latestStr) : {}
    };
  } catch (e) {
    return { first: {}, latest: {} };
  }
}

export function appendUTMsToUrl(url: string): string {
  if (typeof window === "undefined" || !url) return url;
  
  try {
    const { latest } = getUTMs();
    if (Object.keys(latest).length === 0) return url;
    
    const parsedUrl = new URL(url, window.location.origin);
    Object.entries(latest).forEach(([k, v]) => {
      if (!parsedUrl.searchParams.has(k) && v) {
        parsedUrl.searchParams.set(k, v);
      }
    });
    return parsedUrl.toString();
  } catch (e) {
    return url;
  }
}

export function trackEvent(eventName: TrackingEventName, params?: TrackingParams) {
  if (typeof window === "undefined") return;

  const dataLayer = (window as any).dataLayer || [];
  const { first, latest } = getUTMs();
  
  const flatUTMs: Record<string, string> = {};
  Object.entries(first).forEach(([k, v]) => {
    if (v) flatUTMs[`first_${k}`] = v;
  });
  Object.entries(latest).forEach(([k, v]) => {
    if (v) flatUTMs[`latest_${k}`] = v;
    if (v) flatUTMs[k] = v; // Store default dimension too
  });

  dataLayer.push({
    event: eventName,
    ...params,
    ...flatUTMs,
  });

  // Meta Standard Event Compatibility map
  if (typeof (window as any).fbq === "function") {
    let fbEvent = "trackCustom";
    let fbEventName = eventName;
    
    if (eventName === "page_view") {
      fbEvent = "track";
      fbEventName = "PageView";
    } else if (eventName === "form_submit") {
      fbEvent = "track";
      fbEventName = "Lead";
    } else if (eventName === "cta_click") {
      fbEvent = "trackCustom";
      fbEventName = "CTAClick";
    } else if (eventName === "contact_action") { // Add virtual map for contact
      fbEvent = "track";
      fbEventName = "Contact";
    }

    (window as any).fbq(fbEvent, fbEventName, {
      ...params,
      ...latest
    });
  }
}

export function grantConsent(type: "analytics" | "marketing" | "all" | "rejected") {
  if (typeof window === "undefined") return;
  const dataLayer = (window as any).dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  if (type === "all" || type === "analytics") {
    // @ts-ignore
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  } else if (type === "rejected") {
    // @ts-ignore
    gtag('consent', 'update', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });
  }
  
  if (type === "all" || type === "marketing") {
    // @ts-ignore
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted'
    });
  }
}

export function buildDeviceType(): "desktop" | "mobile" | "tablet" | "unknown" {
  if (typeof window === "undefined") return "unknown";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}
