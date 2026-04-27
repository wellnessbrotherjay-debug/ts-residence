"use client";

import { BTN_SOLID } from "../../constants";
import { FadeInView, StaggerContainer, StaggerItem } from "../animations";
import type { Page } from "../../types";

const EXTERIOR_IMAGES = [
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/8a2ce61d-0aed-4265-e5f8-6e6381d64a00/public",
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/4e0599e2-235b-4ada-b3c1-6dde402f2500/public",
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/9eb192a5-3735-4bdb-10a8-e152a3b3ff00/public",
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/826f64ed-0c53-48c0-c9f5-3e3f9da6b400/public",
];

export const HomeWhySeminyak = ({
  setPage,
}: {
  setPage: (p: Page) => void;
}) => (
  <section
    data-reveal-profile="cinematic"
    className="border-gold/35 bg-cream-dark grid grid-cols-1 border-y lg:min-h-screen lg:grid-cols-[1.2fr_0.8fr]"
  >
    <FadeInView
      direction="left"
      className="relative min-h-[34vh] md:min-h-[50vh] lg:min-h-full"
    >
      <div className="relative h-full w-full">
        <img
          src={EXTERIOR_IMAGES[0]}
          alt="TS Residence exterior"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-5 text-white md:p-10 lg:p-14">
          <p className="label-caps text-white/65">TS Residence Exterior</p>
          <p className="mt-3 max-w-104 font-serif text-[1.65rem] leading-[0.95] md:mt-4 md:text-[2.6rem] lg:text-[3.2rem]">
            A premier address with hotel presence
          </p>
        </div>
      </div>
    </FadeInView>

    <div className="flex items-center px-4 py-8 md:px-10 md:py-12 lg:px-14 lg:py-16 xl:px-18">
      <div className="w-full">
        <FadeInView direction="right">
          <span className="label-caps text-gold">Why Seminyak</span>
          <h2 className="heading-section text-ink mt-4">
            Live where every day feels extraordinary
          </h2>
          <p className="text-body text-ink-light mt-4 text-[0.95rem] leading-6 md:mt-5 md:text-base md:leading-7">
            TS Residence places you in a neighborhood that feels both indulgent
            and practical, with the best of Bali always within easy reach.
          </p>
        </FadeInView>

        <FadeInView direction="right" delay={0.2}>
          <div className="border-gold/20 mt-6 space-y-2.5 border-t pt-4 md:mt-8 md:space-y-3 md:pt-5 lg:mt-10">
            {[
              "Strategically located for shopping, dining, and entertainment",
              "Safe, expat-friendly, and easy to navigate",
              "Digital-friendly cafes and daily convenience close by",
              "Well-developed access to hospital, wellness, and retail",
              "A practical base for long stays in Bali",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="bg-gold/20 mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                <p className="text-ink-light text-xs leading-5 sm:text-sm">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </FadeInView>

        <FadeInView direction="right" delay={0.35}>
          <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:gap-4 lg:mt-10">
            {[
              ["Seminyak Beach", "5 min"],
              ["Hospital", "10 min"],
              ["Airport", "20 min"],
              ["Access", "Easy"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-gold/25 bg-white border p-4 text-center shadow-sm transition-all hover:shadow-md hover:border-gold/40"
              >
                <p className="label-caps text-ink/55 text-[9px] uppercase tracking-wider">{label}</p>
                <p className="text-gold-dark mt-2 font-serif text-xl leading-none md:text-2xl">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </FadeInView>

        <FadeInView direction="right" delay={0.42}>
          <div className="mt-6 md:mt-8 lg:mt-10">
            <p className="label-caps text-gold mb-3 text-center">Arrival Perspective</p>
            <StaggerContainer className="grid grid-cols-1 gap-3 sm:grid-cols-3" staggerDelay={0.1}>
              {EXTERIOR_IMAGES.slice(1).map((image, index) => (
                <StaggerItem
                  key={image}
                  className="border-gold/30 overflow-hidden rounded-lg border bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <img
                    src={image}
                    alt={`TS Residence exterior detail ${index + 2}`}
                    className="aspect-4/3 h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeInView>

        <FadeInView direction="right" delay={0.45}>
          <button
            onClick={() => setPage("contact")}
            className={`${BTN_SOLID} mt-6 md:mt-8 lg:mt-10`}
          >
            Book Apartment
          </button>
        </FadeInView>
      </div>
    </div>
  </section>
);
