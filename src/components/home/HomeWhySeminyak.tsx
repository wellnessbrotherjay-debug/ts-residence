"use client";

import { BTN_SOLID } from "../../constants";
import { FadeInView } from "../animations";
import type { Page } from "../../types";


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
        {/* Main exterior image removed */}
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
            {/* Bottom 3 images removed */}
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
