import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";
import { BTN_DARK, BTN_GOLD } from "@/components/site/buttons";

const serviceHighlights = [
  {
    title: "Daily Operations",
    description:
      "Hotel-grade service support managed consistently from early morning to late evening.",
    detail: "06.00 AM - 10.00 PM",
  },
  {
    title: "Integrated Access",
    description:
      "Coworking, dining, salon, and social facilities connected in one residence ecosystem.",
    detail: "One Address",
  },
  {
    title: "Resident Priority",
    description:
      "A long-stay lifestyle built around privacy, ease, and premium everyday convenience.",
    detail: "Service-First",
  },
];

const facilityDescriptions: Record<string, string> = {
  "TS Suites Coworking Space":
    "A polished workspace for focus sessions, private calls, and productive daily routines.",
  TSTORE:
    "A curated retail stop for daily essentials and lifestyle needs within immediate reach.",
  "Christophe C Salon":
    "Professional grooming and beauty care tailored to a refined residential lifestyle.",
  "TS Suites Bar":
    "An elegant social venue for evening drinks, informal meetings, and relaxed conversations.",
};

const facilityCards = [
  {
    title: "TS Suites Coworking Space",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-suites-coworking-space-red-dress-woman-scaled.webp",
  },
  {
    title: "TSTORE",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/09/tstore-designer-hub-ts-residence.webp",
  },
  {
    title: "Christophe C Salon",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/christophe-salon-img-scaled-e1759999189370.webp",
  },
  {
    title: "TS Suites Bar",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/09/tsbar-seminyak.webp",
  },
];

export const metadata: Metadata = {
  title: "Five-Star Living",
  description:
    "Experience integrated five-star facilities and service-led long-stay living at TS Residence.",
  alternates: { canonical: "/five-star-living" },
};

export default function Page() {
  return (
    <div className="bg-cream overflow-x-hidden">
      <section className="border-gold/30 relative min-h-[76vh] overflow-hidden border-y md:min-h-[90vh]">
        <Image
          src="https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp"
          alt="TS Residence Five-Star Living"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/52 via-black/34 to-black/64" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.09),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(184,150,90,0.18),transparent_52%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-black/62 to-transparent" />

        <div className="relative flex min-h-[76vh] w-full items-center justify-center px-6 py-18 text-center md:min-h-[90vh] md:px-12 md:py-22 lg:px-20 lg:py-24 xl:px-28">
          <FadeInView className="w-full max-w-300 text-white">
            <div className="border-gold/45 inline-flex items-center gap-3 border bg-black/58 px-5 py-2.5">
              <span className="text-gold-light text-[11px] font-semibold tracking-[0.24em] uppercase">
                Five-Star Living
              </span>
              <span className="relative flex h-2 w-2">
                <span className="bg-gold-light absolute inline-flex h-full w-full animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full opacity-75" />
                <span className="bg-gold-light relative inline-flex h-2 w-2 rounded-full" />
              </span>
              <span className="text-[11px] font-medium tracking-[0.2em] text-white/95 uppercase">
                Everyday | 06.00 AM - 10.00 PM
              </span>
            </div>

            <h1 className="mx-auto mt-8 max-w-[14.5ch] font-serif text-[3.45rem] leading-[0.9] tracking-[-0.03em] text-white sm:text-7xl md:text-[6.3rem] lg:text-[7.4rem]">
              Five-star service,
              <br />
              now redefined for
              <br />
              long-stay residence.
            </h1>

            <p className="mx-auto mt-9 max-w-190 text-[1.08rem] leading-8 text-white/92 [text-shadow:0_2px_18px_rgba(0,0,0,0.38)] md:text-[1.16rem] md:leading-9">
              Experience seamless access to curated facilities and hospitality
              standards designed for comfort, productivity, and elevated living
              in Seminyak.
            </p>

            <div className="via-gold/55 mx-auto mt-9 h-px w-full max-w-115 bg-linear-to-r from-transparent to-transparent" />
          </FadeInView>
        </div>
      </section>

      <section className="border-gold/30 border-b bg-white">
        <div className="section-shell px-6 py-16 md:px-12 md:py-18 lg:px-20 lg:py-22 xl:px-28">
          <FadeInView className="mx-auto mb-10 max-w-215 text-center lg:mb-12">
            <p className="label-caps text-gold">Operating Signature</p>
            <h2 className="text-ink mt-4 font-serif text-[2.1rem] leading-[1.02] md:text-[2.9rem] lg:text-5xl">
              Structured service rhythm,
              <br />
              designed to feel effortless.
            </h2>
          </FadeInView>
          <StaggerContainer
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5"
            staggerDelay={0.17}
          >
            {serviceHighlights.map((item, idx) => (
              <StaggerItem
                key={item.title}
                className="group border-gold/25 bg-cream border px-6 py-7 transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(28,25,23,0.08)] md:px-7 md:py-8"
              >
                <div className="flex items-center justify-between">
                  <p className="label-caps text-gold-dark">{item.title}</p>
                  <span className="text-gold/60 font-serif text-[1.35rem]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="from-gold/30 via-gold/15 mt-4 h-px w-full bg-linear-to-r to-transparent" />
                <p className="text-ink/80 mt-5 text-[1rem] leading-8">
                  {item.description}
                </p>
                <p className="text-gold-dark mt-4 text-[11px] font-semibold tracking-[0.22em] uppercase">
                  {item.detail}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-gold/30 bg-cream border-b">
        <div className="section-shell px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28">
          <FadeInView className="mx-auto max-w-225 text-center">
            <p className="label-caps text-gold">Signature Facilities</p>
            <h2 className="text-ink mt-5 font-serif text-[2.35rem] leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-[3.2rem] lg:text-6xl">
              Privileges designed for
              <br />
              elevated monthly living.
            </h2>
            <p className="text-ink/80 mx-auto mt-7 max-w-190 text-[1.03rem] leading-8 md:text-[1.1rem]">
              Each facility supports a seamless rhythm from focused work
              sessions to grooming and social downtime.
            </p>
          </FadeInView>
        </div>
      </section>

      <section className="w-full px-6 py-12 md:px-10 md:py-14 lg:px-12 lg:py-16 xl:px-14">
        <StaggerContainer
          className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4"
          staggerDelay={0.14}
        >
          {facilityCards.map((facility) => (
            <StaggerItem
              key={facility.title}
              className="group border-gold/25 h-full overflow-hidden border bg-white"
            >
              <article className="h-full">
                <div className="h-70 overflow-hidden md:h-80 lg:h-87.5">
                  <Image
                    src={facility.image}
                    alt={facility.title}
                    width={1200}
                    height={900}
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.045]"
                  />
                </div>
                <div className="flex min-h-70 flex-col p-6 md:min-h-75 md:p-7">
                  <p className="label-caps text-gold-dark">Facility Access</p>
                  <h3 className="text-ink mt-3 font-serif text-[2rem] leading-[1.04]">
                    {facility.title}
                  </h3>
                  <p className="text-ink/80 mt-4 text-[1rem] leading-7">
                    {facilityDescriptions[facility.title]}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="border-gold/30 border-y bg-white">
        <div className="section-shell grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
          <FadeInView
            direction="left"
            className="relative min-h-90 overflow-hidden md:min-h-105 lg:min-h-130"
          >
            <Image
              src="https://tsresidence.id/wp-content/uploads/2025/10/TS-Suites-Rooftop-Infinity-Pool.webp"
              alt="Five-star facilities"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-1800 ease-out hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
          </FadeInView>
          <div className="flex items-center px-6 py-14 md:px-12 lg:px-14 lg:py-18">
            <FadeInView direction="right" className="max-w-136">
              <p className="label-caps text-gold">Resident Benefit</p>
              <h3 className="text-ink mt-5 font-serif text-[2.2rem] leading-[1.04] tracking-[-0.03em] md:text-[2.9rem]">
                One residence,
                <br />
                multiple premium experiences.
              </h3>
              <p className="text-ink/80 mt-6 text-[1.02rem] leading-8">
                Enjoy integrated access to dining, social spaces, personal care,
                and business-ready facilities without leaving your residential
                environment.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/contact" className={BTN_GOLD}>
                  Book Apartment
                </Link>
                <Link href="/offers" className={BTN_DARK}>
                  View Offers
                </Link>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      <section className="border-gold/30 bg-cream border-b">
        <div className="section-shell px-6 py-14 text-center md:px-12 md:py-16 lg:px-20 lg:py-20 xl:px-28">
          <FadeInView className="mx-auto max-w-200">
            <p className="label-caps text-gold">Private Tour</p>
            <h4 className="text-ink mt-4 font-serif text-[2.2rem] leading-[1.03] md:text-[2.9rem]">
              Schedule a private viewing and experience the full five-star
              standard.
            </h4>
            <p className="text-ink/80 mt-6 text-[1.03rem] leading-8">
              Our team will guide you through facilities, apartment
              availability, and tailored long-stay options for your lifestyle
              needs.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className={BTN_GOLD}>
                Arrange Viewing
              </Link>
              <Link href="/apartments" className={BTN_DARK}>
                Explore Apartments
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
