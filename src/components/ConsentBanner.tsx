"use client";

import { useEffect, useState } from "react";
import { grantConsent } from "@/lib/tracking";

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if consent has already been answered
    const stored = localStorage.getItem("cookie_consent");
    if (!stored) {
      setShow(true);
    } else {
      // Re-grant if previously granted
      if (stored === "all" || stored === "analytics" || stored === "marketing") {
        grantConsent(stored as any);
      }
    }
  }, []);

  const handleConsent = (type: "all" | "analytics" | "marketing" | "rejected") => {
    localStorage.setItem("cookie_consent", type);
    grantConsent(type);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gold/30 bg-cream p-5 text-ink shadow-[0_-10px_40px_rgba(0,0,0,0.06)] md:p-6 lg:flex lg:items-center lg:justify-between lg:px-12">
      <div className="max-w-3xl lg:pr-8">
        <h3 className="font-serif text-xl mb-2 text-gold-dark">We value your privacy</h3>
        <p className="text-sm leading-relaxed text-ink/80">
          We use cookies to enhance your experience, analyze site traffic, and assist in our marketing efforts. 
          By clicking &quot;Accept All&quot;, you agree to the storing of cookies on your device.
        </p>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 lg:mt-0 lg:shrink-0">
        <button
          onClick={() => handleConsent("rejected")}
          className="border border-ink/20 px-5 py-2.5 text-xs font-semibold tracking-widest text-ink uppercase transition-colors hover:bg-ink/5"
        >
          Decline
        </button>
        <button
          onClick={() => handleConsent("all")}
          className="bg-gold px-6 py-2.5 text-xs font-semibold tracking-widest text-white uppercase transition-opacity hover:opacity-90"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
