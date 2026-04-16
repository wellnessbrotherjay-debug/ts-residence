import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FadeInView } from "../animations";
import type { Page } from "../../types";

const PILLARS = [
  {
    title: "Five-Star Living",
    eyebrow: "Comfort of five-star living",
    desc: "Stay within the complex of the renowned TS Suites Hotel and enjoy full access to 5-star facilities and amenities. Everything you love about hotel living — now part of your daily lifestyle.",
    bullets: [
      "Restaurant",
      "Leisure Club & co-working space",
      "Christophe C Salon",
      "TStore Designer Hub",
      "Rooftop infinity pool",
      "Courtyard",
    ],
    page: "five-star" as Page,
    img: "https://tsresidence.id/wp-content/uploads/2025/10/ts-suites-coworking-space-red-dress-woman-scaled.webp",
  },
  {
    title: "Healthy Living",
    eyebrow: "Movement, recovery, and daily wellness",
    desc: "Restore with yoga, reformer Pilates, sauna, cold and hot bath, and curated wellness experiences designed to support long-term living.",
    bullets: [
      "Reformer Pilates",
      "Cold & hot bath",
      "Juice bar & nutritional cafe",
      "Dressing room & massage",
      "IV infusion",
      "Social & wellness events",
    ],
    page: "healthy" as Page,
    img: "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tsc-yoga-class.webp",
  },
  {
    title: "Easy Living",
    eyebrow: "Convenience, flexibility, and flow",
    desc: "Live with practical flexibility, concierge support, and a prime Seminyak address that keeps beach, dining, wellness, and daily essentials within effortless reach.",
    bullets: [
      "5 min to Seminyak Beach",
      "10 min to hospital",
      "20 min to Ngurah Rai Airport",
      "Shopping, dining & entertainment",
      "Easy accessibility",
      "Flexible long-stay setup",
    ],
    page: "easy" as Page,
    img: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/4f514205-a99d-4eb4-40fa-f07f05d9bc00/public",
  },
];

export const HomePillars = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [activePillar, setActivePillar] = useState(0);
  const pillar = PILLARS[activePillar];

  return (
    <section
      data-reveal-profile="cinematic"
      className="bg-white px-5 pb-12 md:px-12 md:pb-16 lg:px-20 lg:pb-18 xl:px-28"
    >
      <FadeInView className="mx-auto max-w-210">
        <div className="border-gold/18 border-t pt-7 md:pt-8">
          <div className="mx-auto max-w-160 text-center">
            <p className="label-caps text-gold">
              Three Pillars. One Lifestyle.
            </p>
            <p className="text-body text-ink-light mt-3 text-[0.95rem] leading-[1.65] md:mt-4 md:text-base md:leading-[1.75]">
              Everything here is designed to elevate how you live, feel, and
              perform daily.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-b border-[#e7ddd0] pb-4 md:mt-8 md:gap-x-7">
            {PILLARS.map((item, index) => {
              const isActive = index === activePillar;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActivePillar(index)}
                  className={`font-serif text-[1.08rem] leading-none transition-all duration-300 sm:text-[1.18rem] md:text-[1.55rem] ${
                    isActive
                      ? "text-ink underline decoration-[#2c2218] underline-offset-[8px]"
                      : "text-[#b7aea4] hover:text-[#857768]"
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-7 pt-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-125"
              >
                <p className="text-[0.82rem] font-semibold tracking-[0.08em] text-[#8b7453] uppercase md:text-[0.95rem]">
                  {pillar.eyebrow}
                </p>
                <p className="text-body text-ink-light mt-4 text-[0.97rem] leading-7 md:mt-5 md:text-base md:leading-8">
                  {pillar.desc}
                </p>
                <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2.5 md:mt-6 md:grid-cols-2 md:gap-y-3">
                  {pillar.bullets.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="bg-gold mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full" />
                      <p className="text-[0.94rem] leading-6.5 text-[#5f5448] md:text-[0.98rem] md:leading-7">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setPage(pillar.page)}
                  className="text-ink mt-7 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors hover:text-[#8b7453]"
                >
                  Discover More <ArrowRight size={14} />
                </button>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.button
                key={pillar.img}
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onClick={() => setPage(pillar.page)}
                className="group relative block overflow-hidden border border-[#eadfcd] bg-white md:max-w-88 lg:max-w-none"
              >
                <img
                  src={pillar.img}
                  alt={pillar.title}
                  className="aspect-5/4 w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02] md:aspect-4/5"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/34 via-transparent to-transparent" />
              </motion.button>
            </AnimatePresence>
          </div>
        </div>
      </FadeInView>
    </section>
  );
};
