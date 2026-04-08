"use client";
import { useState } from "react";
import { BTN_SOLID } from "@/components/site/buttons";

type ContactFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  stayDuration: string;
  message: string;
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>({
    firstName: "",
    lastName: "",
    email: "",
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
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
    } catch (err: any) {
      setError(err?.message || "Failed to send. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
      {[
        { id: "firstName", label: "First Name", type: "text", placeholder: "First Name" },
        { id: "lastName", label: "Last Name", type: "text", placeholder: "Last Name" },
        { id: "email", label: "Email", type: "email", placeholder: "Email address" },
        { id: "phone", label: "Phone (optional)", type: "text", placeholder: "Phone number" },
      ].map((field) => (
        <div key={field.id} className="space-y-2">
          <label htmlFor={field.id} className="label-caps text-ink">{field.label}</label>
          <input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={form[field.id as keyof typeof form]}
            onChange={handleChange}
            required={field.id !== "phone"}
            className="border-gold/25 placeholder:text-ink/35 focus:border-gold w-full border-b bg-transparent py-3 text-sm transition-colors outline-none"
          />
        </div>
      ))}
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