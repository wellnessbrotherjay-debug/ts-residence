"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  trackEvent,
  buildDeviceType,
  captureUTMs,
  shouldEnableTracking,
} from "@/lib/tracking";
import { detectAndLogAdBlockers } from "@/lib/ad-blocker-detection";

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

// Move env access to top-level for static replacement
const GTM_ID = (
  process.env.NEXT_PUBLIC_GTM_ID ||
  process.env.next_PUBLIC_GTM_ID ||
  "GTM-PRZGL8XM"
)?.trim();
const GA_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.next_PUBLIC_GA_MEASUREMENT_ID)?.trim();
const PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.next_PUBLIC_META_PIXEL_ID)?.trim();
const CLARITY_ID = (process.env.NEXT_PUBLIC_CLARITY_ID || process.env.next_PUBLIC_CLARITY_ID)?.trim();

function appendInlineScript(id: string, content: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.text = content;
  document.head.appendChild(script);
}

function appendExternalScript(id: string, src: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = true;
  script.defer = false;
  // Add integrity and crossorigin for security
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
}

/**
 * Load tracking scripts through first-party API endpoint
 * This bypasses ad blockers by masking third-party tracking requests
 */
function loadTrackingScript(id: string, type: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.src = `/api/tracking-proxy?type=${type}`;
  script.async = true;
  script.defer = false;
  script.onload = () => {
    // Script loaded successfully
    console.debug(`[Tracking] ${type} loaded`);
  };
  script.onerror = () => {
    // Fallback: load directly if proxy fails
    console.debug(`[Tracking] ${type} proxy failed, using direct load`);
    loadDirectTrackingScript(type);
  };
  document.head.appendChild(script);
}

/**
 * Fallback: load tracking scripts directly if proxy is blocked
 */
function loadDirectTrackingScript(type: string) {
  if (type === "gtag" && GA_ID) {
    appendExternalScript("ga-lib-direct", `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
    appendInlineScript("ga-init-direct", 
      `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}', { send_page_view: false });`
    );
  } else if (type === "gtm" && GTM_ID) {
    appendInlineScript("gtm-init-direct",
      `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`
    );
  } else if (type === "fbq" && PIXEL_ID) {
    appendInlineScript("meta-pixel-init-direct",
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('consent', 'revoke');fbq('init', '${PIXEL_ID}');`
    );
  } else if (type === "clarity" && CLARITY_ID) {
    appendInlineScript("clarity-init-direct",
      `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, 'clarity', 'script', '${CLARITY_ID}');`
    );
  }
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!shouldEnableTracking(pathname)) return;

    window.dataLayer = window.dataLayer || [];

    const gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };

    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });
    gtag("set", "url_passthrough", true);

    // Load tracking scripts through first-party proxy endpoints
    // This bypasses ad blockers while maintaining tracking functionality
    if (GTM_ID) {
      loadTrackingScript("gtm-proxy", "gtm");
    }

    if (GA_ID) {
      loadTrackingScript("ga-proxy", "gtag");
    }

    if (PIXEL_ID) {
      loadTrackingScript("fbq-proxy", "fbq");
    }

    if (CLARITY_ID) {
      loadTrackingScript("clarity-proxy", "clarity");
    }

    // Detect ad blockers (runs in background, doesn't block page)
    detectAndLogAdBlockers().catch(() => {
      // Silently fail - ad blocker detection is non-critical
    });
  }, []);

  // Track page views on route change manually for single page transition fidelity
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!shouldEnableTracking(pathname)) return;
    if (searchParams) {
      captureUTMs(searchParams.toString());
    }
    
    // Store the first landing page consistently for attribution.
    if (typeof window !== "undefined" && !localStorage.getItem("ts_landing_page")) {
      localStorage.setItem(
        "ts_landing_page",
        window.location.pathname + window.location.search,
      );
    }
    const segments = pathname.split("/").filter(Boolean);
    const pageName = segments.length > 0 ? segments[segments.length - 1] : "home";
    trackEvent("page_view", {
      page_name: pageName,
      page_path: pathname,
      device_type: buildDeviceType(),
      search: searchParams?.toString() || "",
    });
  }, [pathname, searchParams]);

  // Track scroll depth, engaged session, and global outbound click decoration
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!shouldEnableTracking(pathname)) return;

    let engagedFired = false;
    const scrollMilestones: Record<number, boolean> = { 25: false, 50: false, 75: false, 90: false };

    // Engage session after 30 seconds
    const engageTimer = setTimeout(() => {
      if (!engagedFired) {
        trackEvent("engaged_session", {
          page_path: pathname,
          device_type: buildDeviceType(),
        });
        engagedFired = true;
      }
    }, 30000);

    const onScroll = () => {
      const h = document.documentElement;
      const b = document.body;
      const st = "scrollTop";
      const sh = "scrollHeight";

      const percent: number = Math.round(((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100);

      (Object.keys(scrollMilestones) as string[]).forEach((milestone) => {
        const milestoneNum = Number(milestone);
        if (percent >= milestoneNum && !scrollMilestones[milestoneNum]) {
          scrollMilestones[milestoneNum] = true;
          trackEvent("scroll_depth", {
            page_path: pathname,
            depth: milestoneNum,
            device_type: buildDeviceType(),
          });
        }
      });
    };

    const onClick = async (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button');
      if (!target) return;
      const isLink = target.tagName === 'A';
      const href = isLink ? (target as HTMLAnchorElement).href : null;
      const text = (target as HTMLElement).innerText || (target as HTMLElement).getAttribute('aria-label') || 'unlabeled';
      let eventType: 'cta_click' | 'booking_intent' | 'social_click' | 'nav_click' = 'cta_click';
      if (isLink && href) {
        const isExternal = (target as HTMLAnchorElement).hostname && (target as HTMLAnchorElement).hostname !== window.location.hostname;
        if (href.includes("wa.me") || href.includes("instagram.com")) {
          eventType = "social_click";
        } else if (!isExternal) {
          eventType = "nav_click";
        }

        if (
          href.includes("wa.me") ||
          href.includes("booking") ||
          href.includes("townsquare") ||
          /book apartment|contact concierge|send inquiry/i.test(text)
        ) {
          eventType = "booking_intent";
        }

        // Decorate cross-domain booking/contact links with UTMs dynamically
        if (href.includes("wa.me") || href.includes("booking") || href.includes("townsquare")) {
          e.preventDefault();
          const { appendUTMsToUrl } = await import("@/lib/tracking");
          const decorated = appendUTMsToUrl(href);
          if (href.includes("wa.me")) {
            // Show email capture modal before navigating to WhatsApp
            window.dispatchEvent(
              new CustomEvent("wa-capture", {
                detail: { url: decorated, page: window.location.pathname },
              })
            );
          } else {
            window.open(decorated, (target as HTMLAnchorElement).target === "_blank" ? "_blank" : "_self");
          }
        }
      }
      trackEvent(eventType, {
        page_path: pathname,
        link_url: href || 'interaction',
        link_text: text,
        intent_type: eventType === "booking_intent" ? "booking_or_inquiry" : undefined,
        device_type: buildDeviceType(),
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);

    return () => {
      clearTimeout(engageTimer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, [pathname]);

  useEffect(() => {
    const proxyPath = "/api/image?url=";
    const fallback = "/ts-logo.svg";

    const handleImageError = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;

      if (target.dataset.proxyRetry !== "1") {
        const original = target.currentSrc || target.src || "";
        if (original.startsWith("http")) {
          target.dataset.proxyRetry = "1";
          target.src = proxyPath + encodeURIComponent(original);
          return;
        }
      }

      if (target.dataset.fallbackApplied === "1") return;
      target.dataset.fallbackApplied = "1";
      target.src = fallback;
    };

    document.addEventListener("error", handleImageError, true);

    return () => {
      document.removeEventListener("error", handleImageError, true);
    };
  }, []);

  return null;
}
