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

export function trackEvent(eventName: TrackingEventName, params?: TrackingParams) {
  if (typeof window === "undefined") return;

  const dataLayer = (window as any).dataLayer || [];
  
  dataLayer.push({
    event: eventName,
    ...params,
  });
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
