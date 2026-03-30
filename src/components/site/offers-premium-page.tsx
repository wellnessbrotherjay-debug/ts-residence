import Link from "next/link";
import { offers } from "@/lib/site-data";
import { FadeInView, StaggerContainer, StaggerItem } from "./animations";
import { BTN_DARK, BTN_GOLD } from "./buttons";

const metaPoints = [
  "Long-stay pricing crafted for monthly residents",
  "Flexible payment options for practical planning",
  "Resident privileges across dining and wellness",
];

export function OffersPremiumPage() {
  const featured = offers[0];
  const listing = offers.slice(1);

  return (
    <div className="overflow-x-hidden bg-cream">
      <section className="relative border-y border-gold/35 bg-white">
        <div className="absolute inset-0 bg-linear-to-b from-white via-cream/40 to-white" />
        <div className="section-shell px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28">
          <FadeInView
            delay={0.08}
            className="relative mx-auto max-w-[960px] text-center"
          >
            <p className="label-caps text-gold">TS Residence Offers</p>
            <h1 className="mt-5 font-serif text-[2.6rem] leading-[0.98] tracking-[-0.03em] text-ink sm:text-6xl md:text-7xl lg:text-8xl">
              Exclusive long-stay
              <br />
              opportunities in Seminyak.
            </h1>
            <p className="mx-auto mt-7 max-w-[760px] text-[1.02rem] leading-8 text-ink/80 md:text-[1.1rem]">
              A refined selection of monthly stay offers, designed to combine
              five-star comfort with practical value and flexibility.
            </p>
          </FadeInView>
        </div>
      </section>

      <section className="border-b border-gold/35 bg-cream">
        <div className="section-shell px-6 py-12 md:px-12 lg:px-20 xl:px-28">
          <StaggerContainer
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5"
            staggerDelay={0.18}
          >
            {metaPoints.map((item, idx) => (
              <StaggerItem
                key={item}
                className="group border border-gold/30 bg-white px-6 py-7 transition-all duration-700 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(28,25,23,0.08)] md:px-7 md:py-8"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-dark">
                    Privilege
                  </p>
                  <span className="font-serif text-[1.4rem] leading-none text-gold/55 transition-colors duration-300 group-hover:text-gold-dark">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-4 h-px w-full bg-gradient-to-r from-gold/30 via-gold/15 to-transparent" />
                <p className="mt-5 text-[1.03rem] leading-8 text-ink/80">
                  {item}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-y border-gold/35 bg-white">
        <FadeInView delay={0.1} className="overflow-hidden">
          <div className="group grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative min-h-[340px] overflow-hidden md:min-h-[460px] lg:min-h-[620px]">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              <div className="absolute left-6 bottom-6 md:left-8 md:bottom-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-light">
                  Featured Offer
                </p>
              </div>
            </div>
            <div className="flex items-center border-t border-gold/35 px-6 py-12 md:px-12 lg:border-t-0 lg:border-l lg:border-gold/35 lg:px-14 lg:py-16">
              <div className="mx-auto w-full max-w-[32rem]">
                <h2 className="font-serif text-[2.2rem] leading-[1.02] text-ink md:text-[2.8rem] lg:text-[3.2rem]">
                  {featured.title}
                </h2>
                <p className="mt-6 text-[1.03rem] leading-8 text-ink/80">
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
              className="h-full overflow-hidden border border-gold/35 bg-white"
            >
              <article className="h-full">
                <div className="h-[280px] overflow-hidden md:h-[320px] lg:h-[360px]">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out hover:scale-[1.045]"
                  />
                </div>
                <div className="flex min-h-[300px] flex-col p-7 md:min-h-[320px] md:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-dark">
                    Offer {String(idx + 2).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-serif text-[2.2rem] leading-[1.02] text-ink md:text-[2.4rem]">
                    {offer.title}
                  </h3>
                  <p className="mt-5 text-[1.02rem] leading-8 text-ink/80">
                    {offer.description}
                  </p>
                  <div className="mt-auto border-t border-gold/30 pt-6">
                    <Link
                      href="/contact"
                      className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark transition-colors duration-300 hover:text-ink"
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

      <section className="relative border-y border-gold/35">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?auto=format&fit=crop&w=2200&q=80"
            alt="Seminyak coast"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="section-shell relative px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28">
          <FadeInView delay={0.12} className="max-w-[760px] text-white">
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

      <section className="border-y border-gold/35 bg-white">
        <div className="section-shell px-6 py-14 text-center md:px-12 md:py-16 lg:px-20 lg:py-20 xl:px-28">
          <FadeInView delay={0.14} className="mx-auto max-w-[760px]">
            <p className="label-caps text-gold">Need A Custom Plan?</p>
            <h4 className="mt-4 font-serif text-[2.2rem] leading-[1.03] text-ink md:text-[2.8rem]">
              Speak with our team for tailored long-stay arrangements.
            </h4>
            <p className="mt-5 text-[1.02rem] leading-8 text-ink/80">
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
