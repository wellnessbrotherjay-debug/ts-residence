"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent, buildDeviceType, captureUTMs } from "@/lib/tracking";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route change manually for single page transition fidelity
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (searchParams) {
      captureUTMs(searchParams.toString());
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

    let engagedFired = false;
    let scrollMilestones = { 25: false, 50: false, 75: false, 90: false };

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

      // @ts-expect-error: scroll calculation for analytics
      const percent: number = Math.round(((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100);

      ((Object.keys(scrollMilestones) as unknown) as Array<keyof typeof scrollMilestones>).forEach((milestone) => {
        if (percent >= Number(milestone) && !scrollMilestones[milestone]) {
          scrollMilestones[milestone] = true;
          trackEvent("scroll_depth", {
            page_path: pathname,
            depth: milestone,
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
      
      let eventType = "cta_click" as 'cta_click' | 'social_click' | 'nav_click';
      
      if (isLink && href) {
        const isExternal = (target as HTMLAnchorElement).hostname && (target as HTMLAnchorElement).hostname !== window.location.hostname;
        
        if (href.includes("wa.me") || href.includes("instagram.com")) {
          eventType = "social_click";
        } else if (!isExternal) {
          eventType = "nav_click";
        }

        // Decorate cross-domain booking/contact links with UTMs dynamically
        if (href.includes("wa.me") || href.includes("booking") || href.includes("townsquare")) {
          e.preventDefault();
          const { appendUTMsToUrl } = await import("@/lib/tracking");
          const decorated = appendUTMsToUrl(href);
          window.open(decorated, (target as HTMLAnchorElement).target === "_blank" ? "_blank" : "_self");
        }
      }

      trackEvent(eventType, {
        page_path: pathname,
        link_url: href || 'interaction',
        link_text: text,
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

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script id="consent-init" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
          });
          gtag('set', 'url_passthrough', true);
        `}
      </Script>

      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      )}

      {GA_ID && !GTM_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('consent', 'revoke'); // Require consent by default
            fbq('init', '${PIXEL_ID}');
          `}
        </Script>
      )}

      {CLARITY_ID && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      )}
    </>
  );
}
