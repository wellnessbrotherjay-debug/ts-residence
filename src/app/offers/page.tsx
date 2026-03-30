import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { offers } from "@/lib/site-data";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";
import { BTN_DARK, BTN_GOLD } from "@/components/site/buttons";

const metaPoints = [
  "Long-stay pricing crafted for monthly residents",
  "Flexible payment options for practical planning",
  "Resident privileges across dining and wellness",
];

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Explore exclusive monthly-stay offers and long-stay privileges at TS Residence.",
  alternates: { canonical: "/offers" },
};

export default function Page() {
  const featured = offers[0];
  const listing = offers.slice(1);

  return (
    <div className="bg-cream overflow-x-hidden">
      <section className="border-gold/35 relative border-y bg-white">
        <div className="via-cream/40 absolute inset-0 bg-linear-to-b from-white to-white" />
        <div className="section-shell px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28">
          <FadeInView
            delay={0.08}
            className="relative mx-auto max-w-240 text-center"
          >
            <p className="label-caps text-gold">TS Residence Offers</p>
            <h1 className="text-ink mt-5 font-serif text-[2.6rem] leading-[0.98] tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-8xl">
              Exclusive long-stay
              <br />
              opportunities in Seminyak.
            </h1>
            <p className="text-ink/80 mx-auto mt-7 max-w-190 text-[1.02rem] leading-8 md:text-[1.1rem]">
              A refined selection of monthly stay offers, designed to combine
              five-star comfort with practical value and flexibility.
            </p>
          </FadeInView>
        </div>
      </section>

      <section className="border-gold/35 bg-cream border-b">
        <div className="section-shell px-6 py-12 md:px-12 lg:px-20 xl:px-28">
          <StaggerContainer
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5"
            staggerDelay={0.18}
          >
            {metaPoints.map((item, idx) => (
              <StaggerItem
                key={item}
                className="group border-gold/30 border bg-white px-6 py-7 transition-all duration-700 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(28,25,23,0.08)] md:px-7 md:py-8"
              >
                <div className="flex items-center justify-between">
                  <p className="text-gold-dark text-[11px] font-semibold tracking-[0.24em] uppercase">
                    Privilege
                  </p>
                  <span className="text-gold/55 group-hover:text-gold-dark font-serif text-[1.4rem] leading-none transition-colors duration-300">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="from-gold/30 via-gold/15 mt-4 h-px w-full bg-linear-to-r to-transparent" />
                <p className="text-ink/80 mt-5 text-[1.03rem] leading-8">
                  {item}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-gold/35 border-y bg-white">
        <FadeInView delay={0.1} className="overflow-hidden">
          <div className="group grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative min-h-85 overflow-hidden md:min-h-115 lg:min-h-155">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-1800 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                <p className="text-gold-light text-[11px] font-semibold tracking-[0.24em] uppercase">
                  Featured Offer
                </p>
              </div>
            </div>
            <div className="border-gold/35 lg:border-gold/35 flex items-center border-t px-6 py-12 md:px-12 lg:border-t-0 lg:border-l lg:px-14 lg:py-16">
              <div className="mx-auto w-full max-w-lg">
                <h2 className="text-ink font-serif text-[2.2rem] leading-[1.02] md:text-[2.8rem] lg:text-[3.2rem]">
                  {featured.title}
                </h2>
                <p className="text-ink/80 mt-6 text-[1.03rem] leading-8">
                  {featured.description}
                </p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Link href="/contact" className={BTN_GOLD}>
                    Claim Offer
                  </Link>
                  <Link href="/apartments" className={BTN_DARK}>
                    View Apartments
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeInView>
      </section>

      <section className="w-full px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20 xl:px-14">
        <StaggerContainer
          className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
          staggerDelay={0.2}
        >
          {listing.map((offer, idx) => (
            <StaggerItem
              key={offer.title}
              className="border-gold/35 h-full overflow-hidden border bg-white"
            >
              <article className="h-full">
                <div className="h-70 overflow-hidden md:h-80 lg:h-90">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    width={1200}
                    height={900}
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-1800 ease-out hover:scale-[1.045]"
                  />
                </div>
                <div className="flex min-h-75 flex-col p-7 md:min-h-80 md:p-8">
                  <p className="text-gold-dark text-[11px] font-semibold tracking-[0.24em] uppercase">
                    Offer {String(idx + 2).padStart(2, "0")}
                  </p>
                  <h3 className="text-ink mt-3 font-serif text-[2.2rem] leading-[1.02] md:text-[2.4rem]">
                    {offer.title}
                  </h3>
                  <p className="text-ink/80 mt-5 text-[1.02rem] leading-8">
                    {offer.description}
                  </p>
                  <div className="border-gold/30 mt-auto border-t pt-6">
                    <Link
                      href="/contact"
                      className="text-gold-dark hover:text-ink text-[11px] font-semibold tracking-[0.22em] uppercase transition-colors duration-300"
                    >
                      Reserve This Offer
                    </Link>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="border-gold/35 relative border-y">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?auto=format&fit=crop&w=2200&q=80"
            alt="Seminyak coast"
            fill
            sizes="100vw"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="section-shell relative px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28">
          <FadeInView delay={0.12} className="max-w-190 text-white">
            <p className="label-caps text-gold-light">Seminyak Lifestyle</p>
            <h4 className="mt-4 font-serif text-[2.2rem] leading-[1.03] md:text-[2.8rem]">
              Stay where resort calm and city access meet every day.
            </h4>
            <p className="mt-5 text-[1.02rem] leading-8 text-white/85">
              Our offers are built for guests who want long-stay comfort with
              the flexibility of a fully serviced five-star residence.
            </p>
          </FadeInView>
        </div>
      </section>

      <section className="border-gold/35 border-y bg-white">
        <div className="section-shell px-6 py-14 text-center md:px-12 md:py-16 lg:px-20 lg:py-20 xl:px-28">
          <FadeInView delay={0.14} className="mx-auto max-w-190">
            <p className="label-caps text-gold">Need A Custom Plan?</p>
            <h4 className="text-ink mt-4 font-serif text-[2.2rem] leading-[1.03] md:text-[2.8rem]">
              Speak with our team for tailored long-stay arrangements.
            </h4>
            <p className="text-ink/80 mt-5 text-[1.02rem] leading-8">
              We can adjust terms based on your stay duration, apartment choice,
              and preferred resident benefits.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className={BTN_GOLD}>
                Contact Concierge
              </Link>
              <Link href="/gallery" className={BTN_DARK}>
                Browse Gallery
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
