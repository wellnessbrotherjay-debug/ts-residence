"use client";

import { useEffect, useRef, useState } from "react";

interface WACaptureDetail {
  url: string;
  page: string;
}

export function WhatsAppCaptureModal() {
  const [open, setOpen] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [page, setPage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<WACaptureDetail>).detail;
      setWaUrl(detail.url);
      setPage(detail.page);
      setName("");
      setEmail("");
      setSubmitted(false);
      setOpen(true);
    };
    window.addEventListener("wa-capture", handler);
    return () => window.removeEventListener("wa-capture", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => emailRef.current?.focus(), 100);
    }
  }, [open]);

  function navigate() {
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      navigate();
      return;
    }
    setSubmitting(true);
    try {
      const { getUTMs, ensureTrackingIds } = await import("@/lib/tracking");
      const { first, latest } = getUTMs();
      const { sessionId, visitorId } = ensureTrackingIds();

      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: name.trim() || "WhatsApp",
          lastName: "Visitor",
          email: email.trim(),
          source: latest.utm_source || "direct",
          medium: latest.utm_medium || null,
          campaign: latest.utm_campaign || null,
          sessionId,
          visitorId,
          firstTouch: first,
          latestTouch: latest,
          ctaClicked: "whatsapp_button",
          leadPage: page,
          page,
        }),
      });
      setSubmitted(true);
    } catch {
      // silently fail — still open WA
    } finally {
      setSubmitting(false);
      navigate();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Before you go to WhatsApp"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={navigate}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Gold top bar */}
        <div className="h-1 bg-gradient-to-r from-[#c5a572] via-[#e2c992] to-[#c5a572]" />

        <div className="px-8 py-8">
          {/* WhatsApp icon */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
          </div>

          <h2 className="text-center text-[#1a1a1a] text-xl font-bold mb-1">
            Before we take you to WhatsApp
          </h2>
          <p className="text-center text-[#666] text-sm mb-6 leading-relaxed">
            Drop your email and we&apos;ll send you our availability &amp; rates too — so you have everything in one place.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-3 mb-5">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#e0d8cc] bg-[#faf9f7] text-[#1a1a1a] placeholder-[#bbb] text-sm focus:outline-none focus:border-[#c5a572] focus:ring-1 focus:ring-[#c5a572] transition"
                autoComplete="given-name"
              />
              <input
                ref={emailRef}
                type="email"
                placeholder="Your email address (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#e0d8cc] bg-[#faf9f7] text-[#1a1a1a] placeholder-[#bbb] text-sm focus:outline-none focus:border-[#c5a572] focus:ring-1 focus:ring-[#c5a572] transition"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-lg bg-[#25D366] text-white font-bold text-sm tracking-wide hover:bg-[#1ebe5d] active:bg-[#17a852] transition disabled:opacity-60 mb-3"
            >
              {submitting ? "Saving..." : email ? "Send & Open WhatsApp →" : "Open WhatsApp →"}
            </button>

            <button
              type="button"
              onClick={navigate}
              className="w-full py-2.5 text-[#999] text-xs hover:text-[#555] transition"
            >
              Skip — go to WhatsApp without leaving email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
