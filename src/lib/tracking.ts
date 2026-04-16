// ============================================
// BEHAVIORAL TRACKING ENGINE
// Enhanced Analytics & CRM System
// ============================================

// ============================================
// TYPES & INTERFACES
// ============================================

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
  | "consent_update"
  | "quiz_complete"
  | "quiz_abandon"
  | "button_click"
  | "link_click"
  | "whatsapp_click"
  | "booking_click"
  | "video_play"
  | "video_pause"
  | "video_complete"
  | "download"
  | "exit_intent"
  | "time_on_page"
  | "session_start"
  | "session_end"
  | "funnel_step";

export interface TrackingParams {
  page_name?: string;
  page_path?: string;
  page_title?: string;
  cta_label?: string;
  section?: string;
  component?: string;
  device_type?: "desktop" | "mobile" | "tablet" | "unknown";
  // Click-specific
  element_type?: string;
  element_text?: string;
  element_id?: string;
  element_class?: string;
  element_selector?: string;
  link_url?: string;
  // Scroll-specific
  depth?: number;
  scroll_max?: number;
  // Time-specific
  time_on_page?: number;
  // Form-specific
  form_name?: string;
  form_id?: string;
  // Funnel-specific
  funnel_name?: string;
  step_name?: string;
  step_number?: number;
  value?: number;
  currency?: string;
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
  msclkid?: string;
}

export interface GeoLocation {
  country?: string;
  region?: string;
  city?: string;
}

export interface DeviceInfo {
  type: "desktop" | "mobile" | "tablet" | "unknown";
  os?: string;
  browser?: string;
  screen_resolution?: string;
  language?: string;
  timezone?: string;
}

export interface SessionData {
  session_id: string;
  visitor_id: string;
  start_time: number;
  last_activity: number;
  pages_visited: string[];
  entry_page: string;
  exit_page?: string;
  engaged: boolean;
  converted: boolean;
  events_count: number;
}

// ============================================
// EVENT BATCHING SYSTEM
// ============================================

class EventBatcher {
  private events: any[] = [];
  private maxBatchSize = 10;
  private maxBatchTime = 5000; // 5 seconds
  private batchTimer: ReturnType<typeof setTimeout> | null = null;
  private endpoint = '/api/analytics/track-batch';

  add(event: any) {
    this.events.push(event);

    if (this.events.length >= this.maxBatchSize) {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }

  private scheduleFlush() {
    if (this.batchTimer) return;
    this.batchTimer = setTimeout(() => this.flush(), this.maxBatchTime);
  }

  private async flush() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsToSend }),
        keepalive: true,
      });
    } catch (e: any) {
      reportTrackingFailure("batch_flush", e?.message || "batch request failed", {
        failed_events_count: eventsToSend.length,
      });
      // If batch fails, try individual events
      for (const event of eventsToSend) {
        try {
          await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
            keepalive: true,
          });
        } catch (singleError: any) {
          reportTrackingFailure("single_event_fallback", singleError?.message || "single event fallback failed", {
            event_type: event?.eventType,
            page: event?.page,
          });
        }
      }
    }
  }
}

const batcher = typeof window !== 'undefined' ? new EventBatcher() : null;

function reportTrackingFailure(stage: string, message: string, extra?: Record<string, any>) {
  if (typeof window === "undefined") return;

  try {
    const payload = {
      sessionId: getSessionId() || `unknown_session_${Date.now()}`,
      visitorId: getVisitorId() || null,
      eventType: "tracking_error",
      eventCategory: "system",
      page: window.location.pathname,
      source: "first_party_tracker",
      metadata: {
        stage,
        message,
        user_agent: navigator.userAgent,
        ...extra,
      },
    };

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // no-op
  }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

const SESSION_KEY = 'ts_session_id';
const VISITOR_KEY = 'ts_visitor_id';
const SESSION_DATA_KEY = 'ts_session_data';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
const HEARTBEAT_INTERVAL = 60 * 1000; // 1 minute

let sessionHeartbeat: ReturnType<typeof setInterval> | null = null;

export function getSession(): SessionData | null {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(SESSION_DATA_KEY);
    if (!data) return null;

    const session: SessionData = JSON.parse(data);

    // Check if session is expired
    const now = Date.now();
    if (now - session.last_activity > SESSION_DURATION) {
      endSession();
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
}

export function createOrUpdateSession(pagePath: string): SessionData {
  if (typeof window === "undefined") {
    return {} as SessionData;
  }

  const existingSession = getSession();
  const now = Date.now();

  if (existingSession) {
    // Update existing session
    existingSession.last_activity = now;
    existingSession.pages_visited.push(pagePath);
    existingSession.events_count++;
    existingSession.exit_page = pagePath;

    localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(existingSession));
    return existingSession;
  }

  // Create new session
  const visitorId = getOrCreateVisitorId();
  const sessionId = `sess_${now}_${Math.random().toString(36).slice(2, 10)}`;

  const newSession: SessionData = {
    session_id: sessionId,
    visitor_id: visitorId,
    start_time: now,
    last_activity: now,
    pages_visited: [pagePath],
    entry_page: pagePath,
    engaged: false,
    converted: false,
    events_count: 1,
  };

  localStorage.setItem(SESSION_KEY, sessionId);
  localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(newSession));

  // Start session heartbeat
  startSessionHeartbeat();

  // Track session start
  trackEvent("session_start", {
    page_path: pagePath,
    device_type: buildDeviceType(),
  });

  return newSession;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";

  let visitorId = localStorage.getItem(VISITOR_KEY);

  if (!visitorId) {
    visitorId = (window.crypto?.randomUUID?.()) ||
      `vis_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(VISITOR_KEY, visitorId);
  }

  return visitorId;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(SESSION_KEY) || "";
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(VISITOR_KEY) || "";
}

function startSessionHeartbeat() {
  if (sessionHeartbeat) return;

  sessionHeartbeat = setInterval(() => {
    const session = getSession();
    if (!session) {
      stopSessionHeartbeat();
      return;
    }

    session.last_activity = Date.now();
    localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(session));

    // Send heartbeat to server to keep session alive
    sendHeartbeat(session.session_id);
  }, HEARTBEAT_INTERVAL);
}

function stopSessionHeartbeat() {
  if (sessionHeartbeat) {
    clearInterval(sessionHeartbeat);
    sessionHeartbeat = null;
  }
}

async function sendHeartbeat(sessionId: string) {
  try {
    await fetch('/api/analytics/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
      keepalive: true,
    });
  } catch (e) {
    // Silently fail
  }
}

export function endSession() {
  if (typeof window === "undefined") return;

  const session = getSession();
  if (!session) return;

  stopSessionHeartbeat();

  const duration = Date.now() - session.start_time;

  // Track session end
  trackEvent("session_end", {
    page_path: window.location.pathname,
    session_duration_seconds: Math.floor(duration / 1000),
    pages_visited_count: session.pages_visited.length,
    device_type: buildDeviceType(),
  });

  // Update session on server
  updateSessionOnServer(session.session_id, {
    end_time: new Date().toISOString(),
    total_duration_seconds: Math.floor(duration / 1000),
    pages_visited: session.pages_visited.length,
    exit_page: session.exit_page || session.entry_page,
  });

  // Clear session data
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_DATA_KEY);
}

async function updateSessionOnServer(sessionId: string, updates: Record<string, any>) {
  try {
    await fetch('/api/analytics/session', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, ...updates }),
      keepalive: true,
    });
  } catch (e) {
    // Silently fail
  }
}

// Mark session as engaged (after 30 seconds of activity)
export function markSessionEngaged() {
  if (typeof window === "undefined") return;

  const session = getSession();
  if (!session || session.engaged) return;

  session.engaged = true;
  localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(session));

  updateSessionOnServer(session.session_id, { engaged: true, engaged_at: new Date().toISOString() });
}

// Mark session as converted
export function markSessionConverted(value = 0, _currency = 'USD') {
  if (typeof window === "undefined") return;

  const session = getSession();
  if (!session) return;

  session.converted = true;
  localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(session));

  updateSessionOnServer(session.session_id, {
    converted: true,
    converted_at: new Date().toISOString(),
    conversion_value: value,
  });
}

// Update session with current attribution data
export function updateSessionAttribution() {
  if (typeof window === "undefined") return;

  const session = getSession();
  if (!session) return;

  const utms = getUTMs();
  const referrer = document.referrer;
  const referrerDomain = referrer ? new URL(referrer).hostname : null;

  updateSessionOnServer(session.session_id, {
    last_source: utms.latest.utm_source || (referrerDomain || 'direct'),
    last_medium: utms.latest.utm_medium || null,
    last_campaign: utms.latest.utm_campaign || null,
    last_term: utms.latest.utm_term || null,
    last_content: utms.latest.utm_content || null,
    last_gclid: utms.latest.gclid || null,
    last_fbclid: utms.latest.fbclid || null,
    last_referrer: referrer || null,
  });
}

// ============================================
// UTM PARAMETER HANDLING
// ============================================

export function captureUTMs(search: string) {
  if (typeof window === "undefined" || !search) return;

  const urlParams = new URLSearchParams(search);

  const currentUTMs: UTMParams = {};
  let hasUTM = false;

  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "ttclid", "msclkid"].forEach((key) => {
    let val = urlParams.get(key);
    if (val) {
      val = val.toLowerCase().replace(/[^a-z0-9_-]/g, "_");
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

    // Update session with new attribution data
    updateSessionAttribution();
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

// ============================================
// DEVICE DETECTION
// ============================================

export function buildDeviceType(): "desktop" | "mobile" | "tablet" | "unknown" {
  if (typeof window === "undefined") return "unknown";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function getDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined") {
    return { type: "unknown" };
  }

  const ua = navigator.userAgent;
  let os = "unknown";
  let browser = "unknown";

  // Detect OS
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iOS|iPhone|iPad|iPod/i.test(ua)) os = "iOS";

  // Detect Browser
  if (/Chrome/i.test(ua) && !/Edge|OPR/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Edge/i.test(ua)) browser = "Edge";
  else if (/Opera|OPR/i.test(ua)) browser = "Opera";

  return {
    type: buildDeviceType(),
    os,
    browser,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language || "en-US",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  };
}

export function getGeoLocation(): GeoLocation {
  if (typeof window === "undefined") return {};

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language || "en-US";

    const localeParts = locale.split("-");
    let country = "";
    let region = "";

    if (localeParts.length === 2) {
      country = localeParts[1].toUpperCase();
    }

    if (timeZone) {
      const parts = timeZone.split("/");
      if (parts.length >= 2) {
        region = parts[1]?.replace(/_/g, " ");
      }
    }

    return { country, region };
  } catch (e) {
    return {};
  }
}

// ============================================
// CORE TRACKING FUNCTION
// ============================================

export function trackEvent(eventName: TrackingEventName, params?: TrackingParams) {
  if (typeof window === "undefined") return;

  try {
    // Ensure session exists
    const session = createOrUpdateSession(params?.page_path || window.location.pathname);

    const dataLayer = (window as any).dataLayer || [];
    const { first, latest } = getUTMs();

    // Flat UTMs for dataLayer
    const flatUTMs: Record<string, string> = {};
    Object.entries(first).forEach(([k, v]) => {
      if (v) flatUTMs[`first_${k}`] = v;
    });
    Object.entries(latest).forEach(([k, v]) => {
      if (v) flatUTMs[`latest_${k}`] = v;
      if (v) flatUTMs[k] = v;
    });

    // Push to dataLayer (Google Analytics / GTM)
    dataLayer.push({
      event: eventName,
      ...params,
      ...flatUTMs,
    });

    // Meta Pixel Events
    if (typeof (window as any).fbq === "function") {
      let fbEvent = "trackCustom";
      let fbEventName: any = eventName;

      if (eventName === "page_view") {
        fbEvent = "track";
        fbEventName = "PageView";
      } else if (eventName === "form_submit") {
        fbEvent = "track";
        fbEventName = "Lead";
      } else if (eventName === "cta_click" || eventName === "booking_click") {
        fbEvent = "trackCustom";
        fbEventName = "CTAClick";
      } else if (eventName === "whatsapp_click") {
        fbEvent = "trackCustom";
        fbEventName = "WhatsAppClick";
      }

      (window as any).fbq(fbEvent, fbEventName, {
        ...params,
        ...latest
      });
    }

    // Build event payload for first-party tracking
    const deviceInfo = getDeviceInfo();
    const geoLocation = getGeoLocation();
    const referrer = document.referrer || null;
    const referrerDomain = referrer ? new URL(referrer).hostname : null;

    const eventPayload = {
      sessionId: session.session_id,
      visitorId: session.visitor_id,
      eventType: eventName,
      eventCategory: getEventCategory(eventName),
      page: params?.page_path || window.location.pathname,
      pageTitle: params?.page_title || document.title,
      source: latest.utm_source || referrerDomain || "direct",
      medium: latest.utm_medium || null,
      campaign: latest.utm_campaign || null,
      term: latest.utm_term || null,
      content: latest.utm_content || null,
      gclid: latest.gclid || null,
      fbclid: latest.fbclid || null,
      ttclid: latest.ttclid || null,
      msclkid: latest.msclkid || null,
      referrer,
      referrerDomain,
      // Click-specific
      elementType: params?.element_type || null,
      elementText: params?.element_text || null,
      elementId: params?.element_id || null,
      elementClass: params?.element_class || null,
      elementSelector: params?.element_selector || null,
      linkUrl: params?.link_url || null,
      // Scroll-specific
      scrollDepth: params?.depth || null,
      // Time-specific
      timeOnPage: params?.time_on_page || null,
      // Form-specific
      formName: params?.form_name || null,
      formId: params?.form_id || null,
      // Funnel-specific
      funnelName: params?.funnel_name || null,
      stepName: params?.step_name || null,
      stepNumber: params?.step_number || null,
      value: params?.value || null,
      currency: params?.currency || null,
      // Location
      country: geoLocation.country || null,
      region: geoLocation.region || null,
      city: geoLocation.city || null,
      timezone: deviceInfo.timezone || null,
      // Device
      deviceType: params?.device_type || deviceInfo.type,
      deviceInfo: {
        os: deviceInfo.os,
        browser: deviceInfo.browser,
        screenResolution: deviceInfo.screen_resolution,
      },
      osInfo: deviceInfo.os,
      browserInfo: { name: deviceInfo.browser },
      screenResolution: deviceInfo.screen_resolution,
      language: deviceInfo.language,
      // Venue
      venueId: window.location.hostname.includes('tsresidence') ? 'ts_residence' : 'unknown',
      // Metadata
      metadata: {
        ...params,
        sessionStartTime: session.start_time,
        pagesVisitedCount: session.pages_visited.length,
      }
    };

    // Use batcher if available, otherwise send directly
    if (batcher) {
      batcher.add(eventPayload);
    } else {
      // Fallback to direct send
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload),
        keepalive: true,
      }).catch(() => {});
    }

  } catch (err) {
    console.warn('Tracking error:', err);
  }
}

function getEventCategory(eventName: TrackingEventName): string {
  const categories: Record<string, string> = {
    page_view: "page",
    cta_click: "click",
    social_click: "click",
    nav_click: "click",
    button_click: "click",
    link_click: "click",
    whatsapp_click: "click",
    booking_click: "click",
    scroll_depth: "scroll",
    engaged_session: "engagement",
    form_start: "form",
    form_submit: "form",
    form_error: "form",
    quiz_complete: "funnel",
    quiz_abandon: "funnel",
    session_start: "session",
    session_end: "session",
    funnel_step: "funnel",
  };
  return categories[eventName] || "other";
}

// ============================================
// ENHANCED CLICK TRACKING
// ============================================

export interface ClickTrackerOptions {
  trackAll?: boolean;
  trackButtons?: boolean;
  trackLinks?: boolean;
  trackIcons?: boolean;
  excludeSelectors?: string[];
}

let clickTrackingEnabled = false;
let clickTrackingOptions: ClickTrackerOptions = {
  trackAll: true,
  trackButtons: true,
  trackLinks: true,
  trackIcons: true,
  excludeSelectors: ['[data-tracking="false"]', '[data-no-track]'],
};

export function initClickTracking(options?: ClickTrackerOptions) {
  if (typeof window === "undefined" || clickTrackingEnabled) return;

  clickTrackingOptions = { ...clickTrackingOptions, ...options };
  clickTrackingEnabled = true;

  document.addEventListener('click', handleClick, true);
}

function shouldTrackElement(element: HTMLElement): boolean {
  // Check exclusions
  for (const selector of clickTrackingOptions.excludeSelectors || []) {
    if (element.matches(selector) || element.closest(selector)) {
      return false;
    }
  }

  // Check if element should be tracked based on type
  const tagName = element.tagName.toLowerCase();

  if (clickTrackingOptions.trackAll) return true;
  if (clickTrackingOptions.trackButtons && tagName === 'button') return true;
  if (clickTrackingOptions.trackLinks && tagName === 'a') return true;
  if (clickTrackingOptions.trackIcons && element.classList.contains('icon')) return true;

  // Check for common CTA classes/attributes
  if (
    element.classList.contains('btn') ||
    element.classList.contains('button') ||
    element.classList.contains('cta') ||
    element.getAttribute('role') === 'button' ||
    element.onclick !== null
  ) {
    return true;
  }

  return false;
}

function handleClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target) return;

  // Find the clickable element
  const clickable = target.closest('a, button, [onclick], [role="button"], .btn, .button, .cta, .icon') as HTMLElement;
  if (!clickable || !shouldTrackElement(clickable)) return;

  try {
    const isLink = clickable.tagName === 'A';
    const href = isLink ? (clickable as HTMLAnchorElement).href : null;

    // Get element info
    const elementInfo = {
      type: clickable.tagName.toLowerCase(),
      text: (clickable.textContent || clickable.getAttribute('aria-label') || clickable.getAttribute('title') || '').trim().slice(0, 100),
      id: clickable.id || undefined,
      classList: Array.from(clickable.classList).join(' ') || undefined,
      selector: getSelector(clickable),
    };

    let eventName: TrackingEventName = "button_click";

    if (isLink && href) {
      const isExternal = (clickable as HTMLAnchorElement).hostname !== window.location.hostname;

      if (href.includes("wa.me") || href.includes("whatsapp")) {
        eventName = "whatsapp_click";
      } else if (href.includes("instagram.com") || href.includes("facebook.com") || href.includes("tiktok.com")) {
        eventName = "social_click";
      } else if (!isExternal) {
        eventName = "nav_click";
      } else {
        eventName = "link_click";
      }
    }

    // Check for booking-related buttons
    if (
      elementInfo.text.toLowerCase().includes('book') ||
      elementInfo.text.toLowerCase().includes('reserve') ||
      elementInfo.classList?.includes('booking') ||
      clickable.getAttribute('data-cta') === 'booking'
    ) {
      eventName = "booking_click";
    } else {
      eventName = "button_click";
    }

    // Get click coordinates for potential heatmap
    const coordinates = {
      x: event.clientX,
      y: event.clientY,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };

    trackEvent(eventName, {
      element_type: elementInfo.type,
      element_text: elementInfo.text,
      element_id: elementInfo.id,
      element_class: elementInfo.classList,
      element_selector: elementInfo.selector,
      link_url: href || undefined,
      page_path: window.location.pathname,
      device_type: buildDeviceType(),
      click_coordinates: coordinates,
    });

    // Track click separately for click_events table
    trackClick(eventName, elementInfo, href, coordinates);

  } catch (e) {
    console.warn('Click tracking error:', e);
  }
}

function getSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${element.id}`;
  }

  const path: string[] = [];
  let current = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector += `#${current.id}`;
      path.unshift(selector);
      break;
    }

    if (current.className) {
      const classes = Array.from(current.classList).slice(0, 2);
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }

    path.unshift(selector);
    current = current.parentElement as HTMLElement;
  }

  return path.join(' > ');
}

function trackClick(
  _eventName: string,
  elementInfo: { type: string; text: string; id: string | null | undefined; classList: string | null | undefined; selector: string },
  href: string | null,
  coordinates: { x: number; y: number; viewportWidth: number; viewportHeight: number }
) {
  const session = getSession();
  if (!session) return;

  const deviceInfo = getDeviceInfo();

  fetch('/api/analytics/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: session.session_id,
      visitor_id: session.visitor_id,
      page: window.location.pathname,
      element_type: elementInfo.type,
      element_text: elementInfo.text,
      element_id: elementInfo.id,
      element_class: elementInfo.classList,
      element_selector: elementInfo.selector,
      link_url: href,
      click_x: coordinates.x,
      click_y: coordinates.y,
      viewport_width: coordinates.viewportWidth,
      viewport_height: coordinates.viewportHeight,
      device_type: deviceInfo.type,
    }),
    keepalive: true,
  }).catch(() => {});
}

// ============================================
// FUNNEL TRACKING
// ============================================

export function trackFunnelStep(
  funnelName: string,
  stepName: string,
  stepNumber: number,
  params?: TrackingParams
) {
  const session = getSession();
  if (!session) return;

  trackEvent("funnel_step", {
    funnel_name: funnelName,
    step_name: stepName,
    step_number: stepNumber,
    ...params,
  });

  // Send separate funnel tracking request
  fetch('/api/analytics/funnel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: session.session_id,
      visitor_id: session.visitor_id,
      funnel_name: funnelName,
      step_name: stepName,
      step_number: stepNumber,
      step_category: getFunnelStepCategory(stepNumber),
      page: window.location.pathname,
      action: stepName,
      metadata: params || {},
    }),
    keepalive: true,
  }).catch(() => {});

  // Update session converted if this is the final step
  if (stepName.toLowerCase().includes('complete') || stepName.toLowerCase().includes('purchase')) {
    markSessionConverted(params?.value || 0, params?.currency || 'USD');
  }
}

function getFunnelStepCategory(stepNumber: number): string {
  if (stepNumber === 1) return 'awareness';
  if (stepNumber <= 3) return 'consideration';
  if (stepNumber <= 5) return 'conversion';
  return 'retention';
}

// Predefined funnels
export const Funnels = {
  BOOKING: 'booking',
  INQUIRY: 'inquiry',
  QUIZ: 'quiz',
  WHATSAPP: 'whatsapp',
};

export const FunnelSteps = {
  VIEW: { name: 'view', number: 1 },
  ENGAGE: { name: 'engage', number: 2 },
  CLICK: { name: 'click', number: 3 },
  FORM_START: { name: 'form_start', number: 4 },
  FORM_SUBMIT: { name: 'form_submit', number: 5 },
  LEAD: { name: 'lead', number: 6 },
  BOOKING: { name: 'booking', number: 7 },
  PURCHASE: { name: 'purchase', number: 8 },
};

// ============================================
// SCROLL TRACKING
// ============================================

export interface ScrollTrackerOptions {
  thresholds?: number[];
  trackMax?: boolean;
  debounceMs?: number;
}

export function initScrollTracking(options?: ScrollTrackerOptions) {
  if (typeof window === "undefined") return;

  const {
    thresholds = [25, 50, 75, 90, 100],
    trackMax = true,
    debounceMs = 100,
  } = options || {};

  const thresholdsReached = new Set<number>();
  let maxScroll = 0;
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

  const handleScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

      // Track max scroll
      if (trackMax && scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
      }

      // Check thresholds
      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !thresholdsReached.has(threshold)) {
          thresholdsReached.add(threshold);

          trackEvent("scroll_depth", {
            page_path: window.location.pathname,
            depth: threshold,
            scroll_max: maxScroll,
            device_type: buildDeviceType(),
          });
        }
      });
    }, debounceMs);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Return cleanup function
  return () => window.removeEventListener("scroll", handleScroll);
}

// ============================================
// TIME ON PAGE TRACKING
// ============================================

let timeOnPageInterval: ReturnType<typeof setInterval> | null = null;
const TIME_ON_PAGE_INTERVAL_MS = 5000;
let trackedPagePath: string | null = null;
let visibleSinceMs: number | null = null;
let accumulatedVisibleMs = 0;
let engagedTracked = false;
let minuteMilestonesTracked = new Set<number>();
let timeListenersBound = false;

function getCurrentVisibleSeconds() {
  let totalMs = accumulatedVisibleMs;
  if (visibleSinceMs && document.visibilityState === "visible") {
    totalMs += Date.now() - visibleSinceMs;
  }
  return Math.max(0, Math.floor(totalMs / 1000));
}

function flushTimeOnPage(reason: string) {
  if (typeof window === "undefined" || !trackedPagePath) return;

  const seconds = getCurrentVisibleSeconds();
  if (seconds <= 0) return;

  trackEvent("time_on_page", {
    page_path: trackedPagePath,
    time_on_page: seconds,
    device_type: buildDeviceType(),
    flush_reason: reason,
  });

  try {
    navigator.sendBeacon('/api/analytics/time-on-page', JSON.stringify({
      page_path: trackedPagePath,
      time_on_page: seconds,
      session_id: getSessionId(),
      visitor_id: getVisitorId(),
      reason,
    }));
  } catch {
    // no-op
  }
}

function bindTimeTrackingListeners() {
  if (timeListenersBound || typeof window === "undefined") return;
  timeListenersBound = true;

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      if (visibleSinceMs) {
        accumulatedVisibleMs += Date.now() - visibleSinceMs;
        visibleSinceMs = null;
      }
      flushTimeOnPage("visibility_hidden");
    } else if (document.visibilityState === "visible") {
      visibleSinceMs = Date.now();
    }
  });

  window.addEventListener("beforeunload", () => {
    flushTimeOnPage("beforeunload");
  });

  window.addEventListener("pagehide", () => {
    flushTimeOnPage("pagehide");
  });
}

export function startTimeOnPageTracking(pagePath = window.location.pathname) {
  if (typeof window === "undefined") return;

  bindTimeTrackingListeners();

  // Route change in SPA: flush old page timing before switching.
  if (trackedPagePath && trackedPagePath !== pagePath) {
    flushTimeOnPage("route_change");
  }

  if (trackedPagePath !== pagePath) {
    trackedPagePath = pagePath;
    accumulatedVisibleMs = 0;
    visibleSinceMs = document.visibilityState === "visible" ? Date.now() : null;
    engagedTracked = false;
    minuteMilestonesTracked = new Set<number>();
  }

  if (timeOnPageInterval) return;

  timeOnPageInterval = setInterval(() => {
    const seconds = getCurrentVisibleSeconds();
    if (!trackedPagePath) return;

    if (!engagedTracked && seconds >= 30) {
      engagedTracked = true;
      trackEvent("engaged_session", {
        page_path: trackedPagePath,
        time_on_page: seconds,
        device_type: buildDeviceType(),
      });
      markSessionEngaged();
    }

    const minuteMark = Math.floor(seconds / 60);
    if (minuteMark >= 1 && !minuteMilestonesTracked.has(minuteMark)) {
      minuteMilestonesTracked.add(minuteMark);
      trackEvent("time_on_page", {
        page_path: trackedPagePath,
        time_on_page: seconds,
        device_type: buildDeviceType(),
        milestone_minutes: minuteMark,
      });
    }
  }, TIME_ON_PAGE_INTERVAL_MS);
}

export function stopTimeOnPageTracking() {
  flushTimeOnPage("manual_stop");
  if (timeOnPageInterval) {
    clearInterval(timeOnPageInterval);
    timeOnPageInterval = null;
  }
}

export function getTimeOnPage(): number {
  return getCurrentVisibleSeconds();
}

// ============================================
// EXIT INTENT TRACKING
// ============================================

export function initExitIntentTracking(callback?: () => void) {
  if (typeof window === "undefined") return;

  const handleExitIntent = (e: MouseEvent) => {
    // Check if mouse is leaving the viewport from top
    if (e.clientY <= 0) {
      trackEvent("exit_intent", {
        page_path: window.location.pathname,
        time_on_page: getTimeOnPage(),
        device_type: buildDeviceType(),
      });

      if (callback) callback();
    }
  };

  document.addEventListener("mouseleave", handleExitIntent);

  // Return cleanup function
  return () => document.removeEventListener("mouseleave", handleExitIntent);
}

// ============================================
// CONSENT MANAGEMENT
// ============================================

export function grantConsent(type: "analytics" | "marketing" | "all" | "rejected") {
  if (typeof window === "undefined") return;

  const dataLayer = (window as any).dataLayer || [];

  // @ts-ignore
  function gtag() { dataLayer.push(arguments); }

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

  // Update Meta Pixel consent
  if (typeof (window as any).fbq === "function") {
    if (type === "all" || type === "marketing") {
      (window as any).fbq('consent', 'grant');
    } else if (type === "rejected") {
      (window as any).fbq('consent', 'revoke');
    }
  }

  // Store consent preference
  localStorage.setItem('consent_preference', type);
}

export function getConsentPreference(): string {
  if (typeof window === "undefined") return "unknown";
  return localStorage.getItem('consent_preference') || "unknown";
}

// ============================================
// INITIALIZATION
// ============================================

export function initTracking() {
  if (typeof window === "undefined") return;

  // Initialize or create session
  createOrUpdateSession(window.location.pathname);

  // Start time on page tracking
  startTimeOnPageTracking();

  // Initialize click tracking
  initClickTracking();

  // Capture UTMs from URL
  captureUTMs(window.location.search);

  // Handle page visibility changes for session tracking
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      // Page visible - resume tracking
      const session = getSession();
      if (session) {
        session.last_activity = Date.now();
        localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(session));
      }
    }
  });

  // Handle page unload
  window.addEventListener("beforeunload", () => {
    endSession();
  });

  // Handle page hide (for mobile/back button)
  window.addEventListener("pagehide", () => {
    endSession();
  });
}

// Auto-initialize when imported on client side
if (typeof window !== "undefined") {
  // Defer initialization to after page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTracking);
  } else {
    // Small delay to ensure other scripts have loaded
    setTimeout(initTracking, 100);
  }
}
