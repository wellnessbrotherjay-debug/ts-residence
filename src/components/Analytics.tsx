"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent, buildDeviceType, captureUTMs } from "@/lib/tracking";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track page views on route change manually for single page transition fidelity
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

  // Track scroll depth, engaged session, and global outbound click decoration
  useEffect(() => {
    if (!mounted) return;

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

      // @ts-ignore
      const percent = Math.round(((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100);

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
      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) return;
      
      const isExternal = target.hostname && target.hostname !== window.location.hostname;
      
      if (isExternal) {
        let eventName: "social_click" | "cta_click" = "cta_click";
        if (target.href.includes("wa.me") || target.href.includes("instagram.com")) {
          eventName = "social_click";
        }

        trackEvent(eventName, {
          page_path: pathname,
          link_url: target.href,
          link_text: target.innerText || "",
          device_type: buildDeviceType(),
        });

        // Decorate cross-domain booking/contact links with UTMs dynamically
        if (target.href.includes("wa.me") || target.href.includes("booking") || target.href.includes("townsquare")) {
          e.preventDefault();
          const { appendUTMsToUrl } = await import("@/lib/tracking");
          const decorated = appendUTMsToUrl(target.href);
          window.open(decorated, target.target === "_blank" ? "_blank" : "_self");
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);

    return () => {
      clearTimeout(engageTimer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, [pathname, mounted]);

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
          <Script src={\`https://www.googletagmanager.com/gtag/js?id=\${GA_ID}\`} strategy="afterInteractive" />
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
