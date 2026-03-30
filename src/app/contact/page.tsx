"use client";

import Link from "next/link";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";
import { BTN_DARK, BTN_GOLD, BTN_SOLID } from "@/components/site/buttons";

const contactCards = [
  {
    label: "Phone / WhatsApp",
    value: "+62 811 1902 8111",
    href: "https://wa.me/6281119028111",
  },
  {
    label: "Email",
    value: "tsresidence@townsquare.co.id",
    href: "mailto:tsresidence@townsquare.co.id",
  },
  {
    label: "Address",
    value:
      "Jl. Nakula No.18, Legian, Seminyak, Kec. Kuta, Kabupaten Badung, Bali 80361",
    href: "https://maps.google.com/?q=TS+Residence+Seminyak",
  },
];

export default function Page() {
  return (
    <div className="overflow-x-hidden bg-cream">
      <section className="relative min-h-[72vh] overflow-hidden border-y border-gold/30 md:min-h-[86vh]">
        <img
          src="https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp"
          alt="Contact TS Residence"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/52 via-black/34 to-black/66" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_82%_80%,rgba(196,160,96,0.2),transparent_52%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-black/62 to-transparent" />

        <div className="relative flex min-h-[72vh] w-full items-center justify-center px-6 py-18 text-center md:min-h-[86vh] md:px-12 md:py-22 lg:px-20 lg:py-24 xl:px-28">
          <FadeInView className="w-full max-w-[1200px] text-white">
            <div className="inline-flex items-center gap-3 border border-gold/45 bg-black/58 px-5 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-light">
                Contact
              </span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gold-light opacity-75 [animation:ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/95">
                Concierge Team
              </span>
            </div>

            <h1 className="mx-auto mt-8 max-w-[14ch] font-serif text-[3.2rem] leading-[0.9] tracking-[-0.03em] text-white sm:text-7xl md:text-[5.7rem] lg:text-[6.8rem]">
              Let&apos;s plan
              <br />
              your long-stay
              <br />
              with confidence.
            </h1>

            <p className="mx-auto mt-9 max-w-[760px] text-[1.08rem] leading-8 text-white/92 [text-shadow:0_2px_18px_rgba(0,0,0,0.38)] md:text-[1.16rem] md:leading-9">
              Reach our team for apartment availability, offers, and tailored
              monthly stay recommendations based on your lifestyle and timeline.
            </p>

            <div className="mx-auto mt-9 h-px w-full max-w-[460px] bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
          </FadeInView>
        </div>
      </section>

      <section className="border-b border-gold/30 bg-white">
        <div className="section-shell px-6 py-16 md:px-12 md:py-18 lg:px-20 lg:py-22 xl:px-28">
          <StaggerContainer
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5"
            staggerDelay={0.16}
          >
            {contactCards.map((item) => (
              <StaggerItem
                key={item.label}
                className="group border border-gold/25 bg-cream px-6 py-7 transition-all duration-[900ms] hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(28,25,23,0.1)] md:px-7 md:py-8"
              >
                <p className="label-caps text-gold-dark">{item.label}</p>
                <p className="mt-5 text-[1.02rem] leading-8 text-ink/85">
                  {item.value}
                </p>
                <div className="mt-6 border-t border-gold/25 pt-5">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark transition-colors duration-300 hover:text-ink"
                  >
                    Open
                  </a>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-b border-gold/30 bg-cream">
        <div className="w-full px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20 xl:px-14">
          <div className="grid grid-cols-1 border border-gold/25 bg-white lg:grid-cols-[0.95fr_1.05fr]">
            <FadeInView
              direction="left"
              className="relative min-h-[360px] overflow-hidden md:min-h-[520px]"
            >
              <img
                src="https://tsresidence.id/wp-content/uploads/2025/08/img-need-help.webp"
                alt="TS Residence contact concierge"
                className="h-full w-full object-cover transition-transform duration-[1700ms] ease-out hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute left-6 right-6 bottom-6 text-white md:left-8 md:right-8 md:bottom-8">
                <p className="label-caps text-gold-light">Need Assistance?</p>
                <p className="mt-4 font-serif text-[2.1rem] leading-[1.02] md:text-[2.8rem]">
                  Our team responds quickly.
                </p>
              </div>
            </FadeInView>

            <div className="px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">
              <FadeInView direction="right">
                <p className="label-caps text-gold">Inquiry Form</p>
                <h2 className="mt-4 font-serif text-[2.1rem] leading-[1.03] text-ink md:text-[2.8rem]">
                  Tell us what you need,
                  <br />
                  we&apos;ll tailor the options.
                </h2>
                <p className="mt-5 text-[1rem] leading-8 text-ink/80 md:text-[1.06rem]">
                  Share your stay timeline and preferences. We&apos;ll help you
                  find the most suitable apartment and arrangement.
                </p>
              </FadeInView>

              <FadeInView direction="right" delay={0.08}>
                <form className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
                  {[
                    {
                      label: "First Name",
                      type: "text",
                      placeholder: "First Name",
                    },
                    {
                      label: "Last Name",
                      type: "text",
                      placeholder: "Last Name",
                    },
                    {
                      label: "Email",
                      type: "email",
                      placeholder: "Email address",
                    },
                    {
                      label: "Phone (optional)",
                      type: "text",
                      placeholder: "Phone number",
                    },
                  ].map((field) => (
                    <div key={field.label} className="space-y-2">
                      <label className="label-caps text-ink">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full border-b border-gold/25 bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-gold"
                      />
                    </div>
                  ))}
                  <div className="space-y-2 md:col-span-2">
                    <label className="label-caps text-ink">Stay Duration</label>
                    <select className="w-full appearance-none border-b border-gold/25 bg-transparent py-3 text-sm outline-none transition-colors focus:border-gold">
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Yearly</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="label-caps text-ink">
                      Message (optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Type your message here..."
                      className="w-full resize-none border-b border-gold/25 bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-gold"
                    />
                  </div>
                  <div className="pt-3 md:col-span-2">
                    <button type="button" className={BTN_SOLID}>
                      Send Inquiry
                    </button>
                  </div>
                </form>
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gold/30 bg-white">
        <div className="w-full px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20 xl:px-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.9fr]">
            <FadeInView className="overflow-hidden border border-gold/25">
              <iframe
                title="TS Residence Location"
                src="https://maps.google.com/maps?q=TS%20Residence%20Seminyak&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-[360px] w-full md:h-[420px] lg:h-[460px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </FadeInView>

            <FadeInView className="flex items-center border border-gold/25 bg-cream px-6 py-10 md:px-10 lg:px-12">
              <div>
                <p className="label-caps text-gold">Visit Us</p>
                <h3 className="mt-4 font-serif text-[2rem] leading-[1.04] text-ink md:text-[2.7rem]">
                  TS Residence,
                  <br />
                  Seminyak Bali
                </h3>
                <p className="mt-5 text-[1rem] leading-8 text-ink/80 md:text-[1.06rem]">
                  Jl. Nakula No.18, Legian, Seminyak, Kec. Kuta, Kabupaten
                  Badung, Bali 80361.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="https://wa.me/6281119028111" className={BTN_GOLD}>
                    Chat WhatsApp
                  </Link>
                  <Link
                    href="mailto:tsresidence@townsquare.co.id"
                    className={BTN_DARK}
                  >
                    Send Email
                  </Link>
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>
    </div>
  );
}
