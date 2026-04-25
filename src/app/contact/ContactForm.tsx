"use client";
import { useState } from "react";
import { BTN_SOLID } from "@/components/site/buttons";

type ContactFormState = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  stayDuration: string;
  message: string;
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+62",
    phone: "",
    stayDuration: "Monthly",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError(null);
    try {
      const [res, leadRes] = await Promise.all([
        fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }),
        fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            page: window.location.pathname,
            source: localStorage.getItem("utm_latest") ? JSON.parse(localStorage.getItem("utm_latest")!).utm_source || "direct" : "direct",
            campaign: localStorage.getItem("utm_latest") ? JSON.parse(localStorage.getItem("utm_latest")!).utm_campaign || null : null,
            referrer: document.referrer || null,
          }),
        }).catch(() => null)
      ]);

      if (res.ok) {
        setSuccess("Your inquiry was sent! We'll reply soon.");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          stayDuration: "Monthly",
          message: "",
        });
        
        // Track the lead form submit event so analytics picks it up
        import("@/lib/tracking").then(({ trackEvent }) => {
          trackEvent("form_submit", { form_name: "contact_inquiry" });
        });
      } else {
        const data = await res.json();
        // Normalize error: handle string or object
        let errorMsg: string;
        if (typeof data.error === "string") {
          errorMsg = data.error;
        } else if (data.error && typeof data.error === "object" && "message" in data.error) {
          errorMsg = String(data.error.message ?? "Something went wrong");
        } else {
          errorMsg = "Failed to send. Try again later.";
        }
        setError(errorMsg);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="firstName" className="label-caps text-ink">First Name</label>
        <input
          id="firstName"
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          className="border-gold/25 placeholder:text-ink/35 focus:border-gold w-full border-b bg-transparent py-3 text-sm transition-colors outline-none"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="lastName" className="label-caps text-ink">Last Name</label>
        <input
          id="lastName"
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          className="border-gold/25 placeholder:text-ink/35 focus:border-gold w-full border-b bg-transparent py-3 text-sm transition-colors outline-none"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="label-caps text-ink">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
          className="border-gold/25 placeholder:text-ink/35 focus:border-gold w-full border-b bg-transparent py-3 text-sm transition-colors outline-none"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="countryCode" className="label-caps text-ink">Country Code</label>
        <input
          id="countryCode"
          type="text"
          placeholder="+62"
          value={form.countryCode}
          onChange={handleChange}
          required
          list="country-codes"
          className="border-gold/25 placeholder:text-ink/35 focus:border-gold w-full border-b bg-transparent py-3 text-sm transition-colors outline-none"
        />
        <datalist id="country-codes">
          <option value="+1">United States/Canada (+1)</option>
          <option value="+44">United Kingdom (+44)</option>
          <option value="+61">Australia (+61)</option>
          <option value="+62">Indonesia (+62)</option>
          <option value="+65">Singapore (+65)</option>
          <option value="+81">Japan (+81)</option>
          <option value="+82">South Korea (+82)</option>
          <option value="+86">China (+86)</option>
          <option value="+91">India (+91)</option>
          <option value="+971">UAE (+971)</option>
          <option value="+49">Germany (+49)</option>
          <option value="+33">France (+33)</option>
          <option value="+34">Spain (+34)</option>
          <option value="+39">Italy (+39)</option>
          <option value="+7">Russia (+7)</option>
          <option value="+66">Thailand (+66)</option>
          <option value="+63">Philippines (+63)</option>
          <option value="+60">Malaysia (+60)</option>
          <option value="+64">New Zealand (+64)</option>
          <option value="+852">Hong Kong (+852)</option>
          <option value="+886">Taiwan (+886)</option>
        </datalist>
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="label-caps text-ink">Phone (optional)</label>
        <input
          id="phone"
          type="text"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          className="border-gold/25 placeholder:text-ink/35 focus:border-gold w-full border-b bg-transparent py-3 text-sm transition-colors outline-none"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label htmlFor="stayDuration" className="label-caps text-ink">Stay Duration</label>
        <select
          id="stayDuration"
          value={form.stayDuration}
          onChange={handleChange}
          className="border-gold/25 focus:border-gold w-full appearance-none border-b bg-transparent py-3 text-sm transition-colors outline-none"
        >
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Yearly</option>
        </select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label htmlFor="message" className="label-caps text-ink">Message (optional)</label>
        <textarea
          id="message"
          rows={4}
          placeholder="Type your message here..."
          value={form.message}
          onChange={handleChange}
          className="border-gold/25 placeholder:text-ink/35 focus:border-gold w-full resize-none border-b bg-transparent py-3 text-sm transition-colors outline-none"
        />
      </div>
      <div className="pt-3 md:col-span-2">
        <button type="submit" className={BTN_SOLID} disabled={loading}>
          {loading ? "Sending..." : "Send Inquiry"}
        </button>
        {success && <p className="mt-3 text-green-600">{success}</p>}
        {(() => {
          if (!error) return null;
          const errorMessage =
            typeof error === "string"
              ? error
              : error && typeof error === "object" && "message" in error
                ? String((error as { message?: unknown }).message ?? "Something went wrong")
                : null;
          return errorMessage ? <p className="mt-3 text-red-600">{errorMessage}</p> : null;
        })()}
      </div>
    </form>
  );
}