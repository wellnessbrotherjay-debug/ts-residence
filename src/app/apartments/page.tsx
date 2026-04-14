"use client";

import Link from "next/link";
import { LockedPageHero } from "@/components/site/LockedPageHero";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";
import { BTN_DARK, BTN_GOLD } from "@/components/site/buttons";
import { apartmentDisplayList } from "@/lib/apartments-content";

export default function Page() {
  return (
    <div className="relative isolate overflow-x-hidden">
      <LockedPageHero
        image="https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/c4bdd92c-22b9-428a-1af4-5b4e3134c000/public"
        alt="TS Residence Apartments"
        heightClassName="h-[86vh] md:h-[88vh]"
        title={
          <>
            Find the apartment
            <br />
            that matches
            <br />
            your rhythm.
          </>
        }
        description="Premium monthly residences designed with five-star comfort, practical layouts, and service-led convenience in Seminyak."
      />

      <section className="border-gold/30 relative z-10 border-b bg-white" data-reveal-profile="hero">
        <div className="mx-auto w-full max-w-440 px-4 py-12 md:px-10 md:py-18 lg:px-12 lg:py-22 xl:px-14">
          <div className="mb-10 max-w-260 md:mb-12">
            <p className="label-caps text-gold">Apartment Collection</p>
            <h2 className="text-ink mt-4 font-serif text-[1.7rem] leading-[1.04] sm:text-[1.95rem] md:text-[3.2rem]">
              Three apartment options,
              <br />
              one premium long-stay standard.
            </h2>
          </div>

          <StaggerContainer
            className="space-y-5 md:space-y-8"
            staggerDelay={0.14}
          >
            {apartmentDisplayList.map((apartment, index) => (
              <StaggerItem
                key={apartment.slug}
                className="group border-gold/25 bg-cream overflow-hidden border"
              >
                <Link
                  href={`/apartments/${apartment.slug}`}
                  className="grid h-full w-full cursor-pointer grid-cols-1 lg:grid-cols-2"
                >
                  <div
                    className={`relative overflow-hidden ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <img
                      src={apartment.image}
                      alt={apartment.name}
                      className="h-54 w-full object-cover transition-transform duration-1800 ease-out group-hover:scale-[1.06] md:h-80 lg:h-130"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute right-5 bottom-5 border border-white/35 bg-black/28 px-3 py-2 text-[10px] tracking-[0.2em] text-white/90 uppercase backdrop-blur-sm md:right-7 md:bottom-7">
                      {apartment.sqm}
                    </div>
                  </div>

                  <div
                    className={`flex items-center px-5 py-7 md:px-9 md:py-12 lg:px-12 lg:py-14 ${index % 2 === 1 ? "lg:order-1" : ""}`}
                  >
                    <div className="max-w-lg" data-reveal-profile="cinematic">
                      <p className="label-caps text-gold-dark">Apartment Type</p>
                      <h3 className="text-ink mt-3 font-serif text-[2.25rem] leading-[0.95] md:mt-4 md:text-[3.6rem]">
                        {apartment.name}
                      </h3>
                      <p className="text-ink/60 mt-2 text-[11px] tracking-[0.16em] uppercase md:mt-3 md:text-[12px] md:tracking-[0.2em]">
                        {apartment.bed}
                      </p>
                      <p className="text-ink/80 mt-4 text-[0.98rem] leading-7 md:mt-6 md:text-[1.08rem] md:leading-8">
                        {apartment.short}
                      </p>
                      <p className="text-ink/65 mt-3 text-[0.92rem] leading-6.5 md:mt-4 md:text-[0.98rem] md:leading-7">
                        {apartment.audience}
                      </p>
                      <div className="border-gold/25 mt-5 border-t pt-5 md:mt-7 md:pt-6">
                        <span className="text-gold-dark group-hover:text-ink text-[11px] font-semibold tracking-[0.22em] uppercase transition-all duration-500 group-hover:tracking-[0.26em]">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-gold/30 bg-cream relative z-10 border-b" data-reveal-profile="hero">
        <div className="w-full px-5 py-12 text-center md:px-10 md:py-16 lg:px-12 lg:py-20 xl:px-14">
          <div className="mx-auto max-w-245">
            <p className="label-caps text-gold">Need Recommendation?</p>
            <h3 className="text-ink mt-4 font-serif text-[1.9rem] leading-[1.05] md:text-[3rem]">
              Let our team suggest the most suitable apartment
              <br />
              for your duration and lifestyle.
            </h3>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap md:mt-10 md:gap-5">
              <Link href="/contact" className={BTN_GOLD}>
                Contact Concierge
              </Link>
              <Link href="/offers" className={BTN_DARK}>
                View Offers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
