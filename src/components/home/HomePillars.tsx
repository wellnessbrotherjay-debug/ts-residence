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
    img: "https://tsresidence.id/wp-content/uploads/2025/08/woman-bathing-at-TS-suite-rooftop-pool-during-a-beautiful-sunset.webp",
  },
];

export const HomePillars = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [activePillar, setActivePillar] = useState(0);
  const pillar = PILLARS[activePillar];

  return (
    <section className="bg-white px-6 pb-14 md:px-12 md:pb-16 lg:px-20 lg:pb-18 xl:px-28">
      <FadeInView className="mx-auto max-w-210">
        <div className="border-gold/18 border-t pt-8">
          <div className="mx-auto max-w-160 text-center">
            <p className="label-caps text-gold">Three Pillars. One Lifestyle.</p>
            <p className="text-body text-ink-light mt-4 leading-[1.75]">
              Everything here is designed to elevate how you live, feel, and
              perform daily.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 border-b border-[#e7ddd0] pb-4">
            {PILLARS.map((item, index) => {
              const isActive = index === activePillar;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActivePillar(index)}
                  className={`font-serif text-[1.3rem] leading-none transition-all duration-300 md:text-[1.55rem] ${
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

          <div className="grid grid-cols-1 gap-8 pt-7 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="max-w-125"
              >
                <p className="text-[0.95rem] font-semibold tracking-[0.08em] text-[#8b7453] uppercase">
                  {pillar.eyebrow}
                </p>
                <p className="text-body text-ink-light mt-5">
                  {pillar.desc}
                </p>
                <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                  {pillar.bullets.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="bg-gold mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full" />
                      <p className="text-[0.98rem] leading-7 text-[#5f5448]">
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
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setPage(pillar.page)}
                className="group relative block overflow-hidden border border-[#eadfcd] bg-white"
              >
                <img
                  src={pillar.img}
                  alt={pillar.title}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
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
