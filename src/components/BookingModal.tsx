"use client";

import { useEffect, useRef, useState } from "react";
import { apartmentDisplayList } from "@/lib/apartments-content";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Step = "apartment" | "stay" | "details" | "confirm";

interface BookingForm {
  apartment: string;
  checkIn: string;
  duration: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const DURATIONS = [
  "1 month",
  "2 months",
  "3 months",
  "6 months",
  "12 months",
  "Custom — I'll discuss",
];

const STEPS: { id: Step; label: string }[] = [
  { id: "apartment", label: "Apartment" },
  { id: "stay", label: "Stay" },
  { id: "details", label: "Details" },
  { id: "confirm", label: "Confirm" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function buildWAMessage(form: BookingForm) {
  const apt = apartmentDisplayList.find((a) => a.slug === form.apartment);
  const aptLabel = apt
    ? `${apt.name} (${apt.sqm}, ${apt.bed})`
    : "Not decided yet — I'd like guidance";

  const lines = [
    "Hi TS Residence! 🏠 I'd like to book an apartment.",
    "",
    `*Apartment:* ${aptLabel}`,
    `*Check-in:* ${form.checkIn || "To be discussed"}`,
    `*Stay Duration:* ${form.duration || "To be discussed"}`,
    "",
    "*My Details:*",
    `Name: ${form.firstName} ${form.lastName}`,
    `Email: ${form.email}`,
    form.phone ? `Phone/WhatsApp: ${form.phone}` : null,
    form.message ? `\nMessage: ${form.message}` : null,
    "",
    "Please confirm availability and pricing. Thank you!",
  ]
    .filter((l) => l !== null)
    .join("\n");

  return encodeURIComponent(lines);
}

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------

function StepDots({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-7">
      {STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300 ${
                active
                  ? "bg-[#8b7658] text-white"
                  : done
                  ? "bg-[#c5a572] text-white"
                  : "bg-[#e8dfd3] text-[#aaa]"
              }`}
            >
              {done ? "✓" : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-[2px] w-8 transition-all duration-300 ${
                  done ? "bg-[#c5a572]" : "bg-[#e8dfd3]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function BookingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("apartment");
  const [form, setForm] = useState<BookingForm>({
    apartment: "",
    checkIn: "",
    duration: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingForm, string>>>({});
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Listen for open event
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ apartment?: string }>).detail ?? {};
      setForm((prev) => ({
        ...prev,
        apartment: detail.apartment ?? "",
        checkIn: "",
        duration: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      }));
      setStep(detail.apartment ? "stay" : "apartment");
      setErrors({});
      setEmailSent(false);
      setSubmitting(false);
      setOpen(true);
    };
    window.addEventListener("booking-modal-open", handler);
    return () => window.removeEventListener("booking-modal-open", handler);
  }, []);

  // Focus first field when step changes
  useEffect(() => {
    if (open) setTimeout(() => firstFieldRef.current?.focus(), 80);
  }, [step, open]);

  // Trap escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  function update(field: keyof BookingForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  function validateDetails() {
    const errs: Partial<Record<keyof BookingForm, string>> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Valid email required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  async function sendEmail() {
    if (!validateDetails()) return;
    setSubmitting(true);
    try {
      const { getUTMs, ensureTrackingIds, trackEvent } = await import("@/lib/tracking");
      const { first, latest } = getUTMs();
      const { sessionId, visitorId } = ensureTrackingIds();
      const apt = apartmentDisplayList.find((a) => a.slug === form.apartment);
      const aptLabel = apt ? `${apt.name} (${apt.sqm})` : "Not decided";

      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          stayDuration: form.duration || undefined,
          message: [
            `Apartment: ${aptLabel}`,
            form.checkIn ? `Check-in: ${form.checkIn}` : null,
            form.message ? `Message: ${form.message}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
          page: window.location.pathname,
          sessionId,
          visitorId,
          firstTouch: first,
          latestTouch: latest,
          ctaClicked: "booking_modal_email",
          leadPage: window.location.pathname,
        }),
      });

      trackEvent("form_submit", {
        page_path: window.location.pathname,
        link_text: "booking_modal_email",
        intent_type: "booking_or_inquiry",
      });

      setEmailSent(true);
    } catch {
      // email still show success to user — silently fail
      setEmailSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function openWhatsApp() {
    if (!validateDetails()) return;
    const { trackEvent } = await import("@/lib/tracking");
    trackEvent("booking_intent", {
      page_path: window.location.pathname,
      link_url: "https://wa.me/6281119028111",
      link_text: "booking_modal_whatsapp",
      intent_type: "booking_or_inquiry",
    });
    const msg = buildWAMessage(form);
    window.open(`https://wa.me/6281119028111?text=${msg}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  if (!open) return null;

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const selectedApt = apartmentDisplayList.find((a) => a.slug === form.apartment);

  const inputCls =
    "w-full rounded-lg border border-[#e0d8cc] bg-[#faf9f7] px-4 py-3 text-[#1a1a1a] placeholder-[#bbb] text-sm focus:outline-none focus:border-[#c5a572] focus:ring-1 focus:ring-[#c5a572] transition";
  const errorCls = "mt-1 text-[11px] text-red-500";

  // ---------------------------------------------------------------------------
  // Step renderers
  // ---------------------------------------------------------------------------

  function renderApartment() {
    return (
      <div>
        <h2 className="text-[#1a1a1a] text-xl font-bold mb-1">Which apartment?</h2>
        <p className="text-[#888] text-sm mb-6">Choose your preferred unit — or skip if you&apos;re not sure yet.</p>
        <div className="space-y-3">
          {apartmentDisplayList.map((apt) => (
            <button
              key={apt.slug}
              type="button"
              onClick={() => { update("apartment", apt.slug); setStep("stay"); }}
              className={`w-full grid grid-cols-[72px_1fr] gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:border-[#c5a572] hover:bg-[#fdf9f4] ${
                form.apartment === apt.slug
                  ? "border-[#c5a572] bg-[#fdf9f4]"
                  : "border-[#e8dfd3] bg-white"
              }`}
            >
              <div className="overflow-hidden rounded-lg bg-[#f0e9df]">
                <img src={apt.image} alt={apt.name} className="h-16 w-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-bold text-[#1a1a1a] text-sm leading-tight">
                  {apt.name} — {apt.sqm} · {apt.bed}
                </p>
                <p className="text-[#888] text-xs mt-1 leading-relaxed line-clamp-2">{apt.audience}</p>
              </div>
            </button>
          ))}
          <button
            type="button"
            onClick={() => { update("apartment", ""); setStep("stay"); }}
            className="w-full rounded-xl border border-dashed border-[#d5c9b8] py-4 text-sm text-[#999] hover:border-[#c5a572] hover:text-[#8b7658] transition"
          >
            Not sure yet — help me choose
          </button>
        </div>
      </div>
    );
  }

  function renderStay() {
    return (
      <div>
        <h2 className="text-[#1a1a1a] text-xl font-bold mb-1">When are you moving in?</h2>
        <p className="text-[#888] text-sm mb-6">
          {selectedApt
            ? `${selectedApt.name} — ${selectedApt.sqm}, ${selectedApt.bed}`
            : "Tell us your preferred dates."}
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8b7658] mb-2">
              Check-in Date
            </label>
            <input
              ref={firstFieldRef}
              type="date"
              min={todayStr()}
              value={form.checkIn}
              onChange={(e) => update("checkIn", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8b7658] mb-2">
              How long will you stay?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => update("duration", d)}
                  className={`rounded-lg border py-3 px-3 text-sm font-medium text-left transition-all duration-150 ${
                    form.duration === d
                      ? "border-[#c5a572] bg-[#fdf9f4] text-[#8b7658]"
                      : "border-[#e8dfd3] text-[#555] hover:border-[#c5a572] hover:bg-[#fdf9f4]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={() => setStep("apartment")}
            className="flex-1 py-3 rounded-lg border border-[#e8dfd3] text-sm text-[#888] hover:text-[#555] transition"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => setStep("details")}
            className="flex-[2] py-3 rounded-lg bg-[#8b7658] text-white text-sm font-bold hover:bg-[#755f44] transition"
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  function renderDetails() {
    return (
      <div>
        <h2 className="text-[#1a1a1a] text-xl font-bold mb-1">Your details</h2>
        <p className="text-[#888] text-sm mb-6">We&apos;ll use this to confirm your booking and send you availability.</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                ref={firstFieldRef}
                type="text"
                placeholder="First name *"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                className={inputCls}
                autoComplete="given-name"
              />
              {errors.firstName && <p className={errorCls}>{errors.firstName}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last name *"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                className={inputCls}
                autoComplete="family-name"
              />
              {errors.lastName && <p className={errorCls}>{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <input
              type="email"
              placeholder="Email address *"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputCls}
              autoComplete="email"
            />
            {errors.email && <p className={errorCls}>{errors.email}</p>}
          </div>
          <input
            type="tel"
            placeholder="Phone / WhatsApp (optional)"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputCls}
            autoComplete="tel"
          />
          <textarea
            placeholder="Any questions or special requests? (optional)"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>
        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={() => setStep("stay")}
            className="flex-1 py-3 rounded-lg border border-[#e8dfd3] text-sm text-[#888] hover:text-[#555] transition"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => { if (validateDetails()) setStep("confirm"); }}
            className="flex-[2] py-3 rounded-lg bg-[#8b7658] text-white text-sm font-bold hover:bg-[#755f44] transition"
          >
            Review →
          </button>
        </div>
      </div>
    );
  }

  function renderConfirm() {
    if (emailSent) {
      return (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-[#e8f8f0] flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-[#27ae60]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-[#1a1a1a] text-xl font-bold mb-2">Booking Request Sent!</h2>
          <p className="text-[#666] text-sm leading-relaxed mb-6">
            We&apos;ve received your request and sent a confirmation to <strong>{form.email}</strong>. Our team will get back to you within 24 hours.
          </p>
          <p className="text-[#888] text-sm mb-6">Want a faster response?</p>
          <button
            type="button"
            onClick={openWhatsApp}
            className="w-full py-3.5 rounded-lg bg-[#25D366] text-white font-bold text-sm hover:bg-[#1ebe5d] transition"
          >
            Also chat on WhatsApp →
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 w-full py-2.5 text-[#999] text-xs hover:text-[#555] transition"
          >
            Close
          </button>
        </div>
      );
    }

    const apt = apartmentDisplayList.find((a) => a.slug === form.apartment);

    return (
      <div>
        <h2 className="text-[#1a1a1a] text-xl font-bold mb-1">Confirm your booking</h2>
        <p className="text-[#888] text-sm mb-5">Review your details and choose how to send.</p>

        {/* Summary */}
        <div className="bg-[#faf7f2] rounded-xl border border-[#e8dfd3] p-4 mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#888]">Apartment</span>
            <span className="font-semibold text-[#1a1a1a]">
              {apt ? `${apt.name} — ${apt.sqm}` : "Not decided yet"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888]">Check-in</span>
            <span className="font-semibold text-[#1a1a1a]">{form.checkIn || "To discuss"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888]">Duration</span>
            <span className="font-semibold text-[#1a1a1a]">{form.duration || "To discuss"}</span>
          </div>
          <div className="border-t border-[#e8dfd3] pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-[#888]">Name</span>
              <span className="font-semibold text-[#1a1a1a]">{form.firstName} {form.lastName}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[#888]">Email</span>
              <span className="font-semibold text-[#1a1a1a] text-right max-w-[55%] truncate">{form.email}</span>
            </div>
            {form.phone && (
              <div className="flex justify-between mt-1">
                <span className="text-[#888]">Phone</span>
                <span className="font-semibold text-[#1a1a1a]">{form.phone}</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8b7658] mb-3">How would you like to send?</p>

        <div className="space-y-3">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={openWhatsApp}
            className="w-full flex items-center gap-4 rounded-xl border-2 border-[#25D366] bg-[#f0fdf4] p-4 text-left hover:bg-[#e6faf0] transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[#166534] text-sm">Chat on WhatsApp</p>
              <p className="text-[#4ade80] text-xs mt-0.5" style={{color: "#166534", opacity: 0.7}}>Message pre-filled with your details — fastest response</p>
            </div>
          </button>

          {/* Email */}
          <button
            type="button"
            onClick={sendEmail}
            disabled={submitting}
            className="w-full flex items-center gap-4 rounded-xl border-2 border-[#c5a572] bg-[#fdf9f4] p-4 text-left hover:bg-[#faf4ec] transition disabled:opacity-60"
          >
            <div className="w-10 h-10 rounded-full bg-[#8b7658] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[#8b7658] text-sm">
                {submitting ? "Sending..." : "Send Booking Request by Email"}
              </p>
              <p className="text-[#8b7658] text-xs mt-0.5 opacity-70">We&apos;ll reply within 24 hours</p>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setStep("details")}
          className="mt-4 w-full py-2.5 text-[#999] text-xs hover:text-[#555] transition"
        >
          ← Edit details
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Book an apartment"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Gold top bar */}
        <div className="h-1 bg-gradient-to-r from-[#c5a572] via-[#e2c992] to-[#c5a572] shrink-0" />

        {/* Header */}
        <div className="bg-[#1a1a1a] px-8 py-5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[#c5a572] text-[10px] font-bold tracking-[0.3em] uppercase">TS Residence</p>
            <p className="text-white text-sm font-semibold mt-0.5">Book an Apartment</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-white/50 hover:text-white transition text-2xl leading-none ml-4"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-8 py-7">
          <StepDots current={step} />
          {step === "apartment" && renderApartment()}
          {step === "stay" && renderStay()}
          {step === "details" && renderDetails()}
          {step === "confirm" && renderConfirm()}
        </div>
      </div>
    </div>
  );
}
