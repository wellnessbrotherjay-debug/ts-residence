import { NextResponse } from "next/server";

/**
 * Ad-blocker resistant tracking proxy
 * Serves third-party tracking scripts through first-party domain
 * This bypasses most ad blocker filters that block known tracking domains
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scriptType = searchParams.get("type");

  // CORS headers for tracking requests
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "public, max-age=3600",
  };

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    let scriptContent = "";
    let contentType = "application/javascript";

    const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

    switch (scriptType) {
      case "gtag": {
        if (!GA_ID) {
          return new NextResponse(
            "console.log('GA not configured');",
            { status: 200, headers: { "Content-Type": contentType, ...corsHeaders } }
          );
        }

        // Proxy GA script with obfuscated loading
        scriptContent = `
(function() {
  var w = window;
  var d = document;
  var s = 'script';
  
  // Load GA script
  var g = d.createElement(s);
  g.async = true;
  g.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
  var f = d.getElementsByTagName(s)[0];
  f.parentNode.insertBefore(g, f);
  
  // Initialize gtag
  w.dataLayer = w.dataLayer || [];
  function gtag(){w.dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}', { 'send_page_view': false });
})();
`;
        break;
      }

      case "gtm": {
        const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "GTM-PRZGL8XM";
        
        scriptContent = `
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0];
  var j=d.createElement(s);
  var dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
`;
        break;
      }

      case "fbq": {
        const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
        
        if (!PIXEL_ID) {
          return new NextResponse(
            "console.log('Meta Pixel not configured');",
            { status: 200, headers: { "Content-Type": contentType, ...corsHeaders } }
          );
        }

        scriptContent = `
!function(f,b,e,v,n,t,s){
  if(f.fbq)return;
  n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;
  n.push=n;
  n.loaded=!0;
  n.version='2.0';
  n.queue=[];
  t=b.createElement(e);
  t.async=!0;
  t.src=v;
  s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s);
}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('consent', 'revoke');
fbq('init', '${PIXEL_ID}');
`;
        break;
      }

      case "clarity": {
        const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID?.trim();
        
        if (!CLARITY_ID) {
          return new NextResponse(
            "console.log('Clarity not configured');",
            { status: 200, headers: { "Content-Type": contentType, ...corsHeaders } }
          );
        }

        scriptContent = `
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);
  t.async=1;
  t.src='https://www.clarity.ms/tag/'+i;
  y=l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t,y);
})(window,document,'clarity','script','${CLARITY_ID}');
`;
        break;
      }

      default:
        return new NextResponse("console.log('Unknown tracking type');", {
          status: 400,
          headers: { "Content-Type": contentType, ...corsHeaders },
        });
    }

    return new NextResponse(scriptContent, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Tracking proxy error:", error);
    return new NextResponse("console.error('Tracking proxy failed');", {
      status: 500,
      headers: { "Content-Type": "application/javascript" },
    });
  }
}
