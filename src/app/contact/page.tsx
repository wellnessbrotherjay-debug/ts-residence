"use client";

import Link from "next/link";
import { LockedPageHero } from "@/components/site/LockedPageHero";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";
import { BTN_DARK, BTN_GOLD, BTN_SOLID } from "@/components/site/buttons";
import { ContactForm } from "./ContactForm";

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
    <div className="relative isolate overflow-x-hidden">
      <LockedPageHero
        image="https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp"
        alt="Contact TS Residence"
        heightClassName="h-[86vh] md:h-[88vh]"
        title={
          <>
            Let&apos;s plan
            <br />
            your long-stay
            <br />
            with confidence.
          </>
        }
        description="Reach our team for apartment availability, offers, and tailored monthly stay recommendations based on your lifestyle and timeline."
      />

      <section className="border-gold/30 relative z-10 border-b bg-white">
        <div className="section-shell px-6 py-16 md:px-12 md:py-18 lg:px-20 lg:py-22 xl:px-28">
          <StaggerContainer
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5"
            staggerDelay={0.16}
          >
            {contactCards.map((item) => (
              <StaggerItem
                key={item.label}
                className="group border-gold/25 bg-cream border px-6 py-7 transition-all duration-900 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(28,25,23,0.1)] md:px-7 md:py-8"
              >
                <p className="label-caps text-gold-dark">{item.label}</p>
                <p className="mt-5 text-[1.02rem] leading-8 text-black">
                  {item.value}
                </p>
                <div className="border-gold/25 mt-6 border-t pt-5">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-dark hover:text-ink text-[11px] font-semibold tracking-[0.22em] uppercase transition-colors duration-300"
                  >
                    Open
                  </a>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-gold/30 bg-cream relative z-10 border-b">
        <div className="w-full px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20 xl:px-14">
          <div className="border-gold/25 grid grid-cols-1 border bg-white lg:grid-cols-[0.95fr_1.05fr]">
            <FadeInView
              direction="left"
              className="relative min-h-90 overflow-hidden md:min-h-130"
            >
              <img
                src="https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/658eddbe-9b08-41bf-2ccc-908e4ea1ff00/public"
                alt="TS Residence contact concierge"
                className="h-full w-full object-cover transition-transform duration-1700 ease-out hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute right-6 bottom-6 left-6 text-white md:right-8 md:bottom-8 md:left-8">
                <p className="label-caps text-white">Need Assistance?</p>
                <p className="mt-4 font-serif text-[2.1rem] leading-[1.02] md:text-[2.8rem]">
                  Our team responds quickly.
                </p>
              </div>
            </FadeInView>

            <div className="px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">
              <FadeInView direction="right">
                <p className="label-caps text-gold">Inquiry Form</p>
                <h2 className="text-ink mt-4 font-serif text-[2.1rem] leading-[1.03] md:text-[2.8rem]">
                  Tell us what you need,
                  <br />
                  we&apos;ll tailor the options.
                </h2>
                <p className="text-ink/80 mt-5 text-[1rem] leading-8 md:text-[1.06rem]">
                  Share your stay timeline and preferences. We&apos;ll help you
                  find the most suitable apartment and arrangement.
                </p>
              </FadeInView>

              {/* Contact Form with Resend integration */}
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="border-gold/30 relative z-10 border-b bg-white">
        <div className="w-full px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20 xl:px-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.9fr]">
            <FadeInView className="border-gold/25 overflow-hidden border">
              <iframe
                title="TS Residence Location"
                src="https://maps.google.com/maps?q=TS%20Residence%20Seminyak&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-90 w-full md:h-105 lg:h-115"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </FadeInView>

            <FadeInView className="border-gold/25 bg-cream flex items-center border px-6 py-10 md:px-10 lg:px-12">
              <div>
                <p className="label-caps text-gold">Visit Us</p>
                <h3 className="text-ink mt-4 font-serif text-[2rem] leading-[1.04] md:text-[2.7rem]">
                  TS Residence,
                  <br />
                  Seminyak Bali
                </h3>
                <p className="text-ink/80 mt-5 text-[1rem] leading-8 md:text-[1.06rem]">
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

      <section className="border-gold/30 bg-cream relative z-10 border-b">
        <div className="w-full px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20 xl:px-14">
          <FadeInView className="mb-10">
            <h2 className="text-ink font-serif text-[2rem] leading-[1.03] md:text-[2.8rem]">
              Terms &amp; Condition
            </h2>
          </FadeInView>

          <StaggerContainer
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6"
            staggerDelay={0.12}
          >
            <StaggerItem className="border-gold/25 border bg-white p-6 md:p-8">
              <h3 className="text-ink font-serif text-[1.7rem] leading-none md:text-[2rem]">
                Terms of Payment
              </h3>
              <ol className="text-ink/80 mt-5 list-decimal space-y-3 pl-5 text-[1rem] leading-8">
                <li>
                  Rental cost paid monthly in advance, by latest on 25th day of
                  the current month. First payment shall be made before Lease
                  Commencement Date.
                </li>
                <li>
                  Refundable Security Deposit, in amount of 1 (one) month rental
                  cost, shall be paid before Lease Commencement Date, together
                  with the first payment of rental cost.
                </li>
                <li>
                  All costs paid are applicable to tax and service charge.
                </li>
              </ol>
            </StaggerItem>

            <StaggerItem className="border-gold/25 border bg-white p-6 md:p-8">
              <h3 className="text-ink font-serif text-[1.7rem] leading-none md:text-[2rem]">
                Included in Rental Cost
              </h3>
              <ol className="text-ink/80 mt-5 list-decimal space-y-2.5 pl-5 text-[1rem] leading-8">
                <li>All units fully furnished</li>
                <li>
                  Access to public area facilities: Pool, Gym,
                  Restaurant/Lounge, Business Center at TS Suites hotel
                </li>
                <li>Parking spot for 1 (one) vehicle</li>
                <li>
                  Room Mechanical, Electrical, &amp; Plumbing maintenance
                  periodically
                </li>
                <li>Internet connection</li>
                <li>TV</li>
                <li>Water usage</li>
                <li>Concierge services</li>
              </ol>
            </StaggerItem>

            <StaggerItem className="border-gold/25 border bg-white p-6 md:p-8">
              <h3 className="text-ink font-serif text-[1.7rem] leading-none md:text-[2rem]">
                Additional Cost (paid separately)
              </h3>
              <ol className="text-ink/80 mt-5 list-decimal space-y-2.5 pl-5 text-[1rem] leading-8">
                <li>Electricity</li>
              </ol>
            </StaggerItem>

            <StaggerItem className="border-gold/25 border bg-white p-6 md:p-8">
              <h3 className="text-ink font-serif text-[1.7rem] leading-none md:text-[2rem]">
                Optional/Add on Services
              </h3>
              <ol className="text-ink/80 mt-5 list-decimal space-y-2.5 pl-5 text-[1rem] leading-8">
                <li>Laundry</li>
                <li>Housekeeping</li>
                <li>Breakfast</li>
              </ol>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
