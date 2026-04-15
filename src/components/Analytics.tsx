"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  trackEvent,
  buildDeviceType,
  captureUTMs,
  initClickTracking,
  initScrollTracking,
  initExitIntentTracking,
  startTimeOnPageTracking,
} from "@/lib/tracking";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [scrollInitialized, setScrollInitialized] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!mounted) return;

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
  }, [pathname, searchParams, mounted]);

  // Initialize enhanced tracking features
  useEffect(() => {
    if (!mounted) return;

    // Initialize click tracking (all buttons, links, icons)
    initClickTracking({
      trackAll: true,
      trackButtons: true,
      trackLinks: true,
      trackIcons: true,
      excludeSelectors: ['[data-tracking="false"]', '[data-no-track]', '.no-track'],
    });

    // Initialize scroll tracking with milestones
    if (!scrollInitialized) {
      initScrollTracking({
        thresholds: [25, 50, 75, 90, 100],
        trackMax: true,
        debounceMs: 100,
      });
      setScrollInitialized(true);
    }

    // Start time on page tracking
    startTimeOnPageTracking();

    // Initialize exit intent tracking (optional)
    const cleanupExitIntent = initExitIntentTracking();

    return () => {
      if (cleanupExitIntent) cleanupExitIntent();
    };
  }, [mounted, pathname]);

  return (
    <>
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

          // Session will be initialized by tracking library
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
