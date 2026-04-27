"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FadeInView } from "../animations";
import type { Page } from "../../types";

type GalleryItem = { image: string; label: string };

const GALLERIES: Record<number, GalleryItem[]> = {
  0: [ // Five-Star Living
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/22f5b499-b941-4dca-11e3-239e22612200/public", label: "Courtyard" },
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/363a5628-6c76-41fd-bac1-16127cdd1500/public", label: "Leisure Club & Co-working" },
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/7b396216-4fa1-457b-b6bf-16588fa18400/public", label: "Gym" },
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/d58a5695-63e7-4c36-7bf0-15b728034c00/public", label: "Christophe C Salon" },
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/331971d0-3b35-4fc1-4c33-6e1dc82fcd00/public", label: "TStore Designer Hub" },
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/d44e04fa-07c2-4c4a-e25f-7082f2534e00/public", label: "Rooftop Infinity Pool" },
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/58f6c170-0414-45be-8f99-e5c795222a00/public", label: "Restaurant" },
  ],
  1: [ // Healthy Living
    { image: "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tsc-yoga-class.webp", label: "Yoga Studio" },
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/22f5b499-b941-4dca-11e3-239e22612200/public", label: "Reformer Pilates" },
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/363a5628-6c76-41fd-bac1-16127cdd1500/public", label: "Wellness Facilities" },
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/7b396216-4fa1-457b-b6bf-16588fa18400/public", label: "Cold & Hot Bath" },
  ],
  2: [ // Easy Living
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/4f514205-a99d-4eb4-40fa-f07f05d9bc00/public", label: "Seminyak Location" },
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/d44e04fa-07c2-4c4a-e25f-7082f2534e00/public", label: "5 Min to Beach" },
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/d58a5695-63e7-4c36-7bf0-15b728034c00/public", label: "Flexible Leases" },
    { image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/331971d0-3b35-4fc1-4c33-6e1dc82fcd00/public", label: "24/7 Security" },
  ],
};

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
  },
];

export const HomePillars = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [activePillar, setActivePillar] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const pillar = PILLARS[activePillar];
  const currentGallery = GALLERIES[activePillar as keyof typeof GALLERIES];

  // Auto-rotate gallery
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      return;
    }

    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % currentGallery.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activePillar, currentGallery.length]);

  return (
    <section
      data-reveal-profile="cinematic"
      className="bg-white px-5 pb-8 md:px-12 md:pb-16 lg:px-20 lg:pb-18 xl:px-28"
    >
      <FadeInView className="mx-auto max-w-210">
        <div className="border-gold/18 border-t pt-5 md:pt-8">
          <div className="mx-auto max-w-160 text-center">
            <p className="label-caps text-gold">
              Three Pillars. One Lifestyle.
            </p>
            <p className="text-body text-ink-light mt-2 hidden text-[0.9rem] leading-[1.55] md:block md:mt-4 md:text-base md:leading-[1.75]">
              Everything here is designed to elevate how you live, feel, and
              perform daily.
            </p>
          </div>

          <div className="mt-5 grid auto-rows-fr w-full max-w-full grid-cols-3 items-stretch gap-2 border-b border-[#e7ddd0] pb-4 md:mt-8 md:gap-3 md:pb-5">
            {PILLARS.map((item, index) => {
              const isActive = index === activePillar;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    setActivePillar(index);
                    setGalleryIndex(0);
                  }}
                  className={`flex h-full w-full min-w-0 items-center justify-center rounded-[16px] border px-1 py-2.5 text-center font-serif transition-all duration-300 md:min-h-12 md:px-3 md:py-2.5 ${
                    isActive
                      ? "border-[#c7a26d] bg-[#f3eadc] text-[#2d2218] shadow-[0_8px_20px_rgba(116,92,59,0.07)]"
                      : "border-[#d2c1ad] bg-white text-[#a08f7d] hover:border-[#c7a26d] hover:text-[#6f614e]"
                  }`}
                >
                  <span className="block w-full min-w-0 px-0.5 text-[clamp(0.56rem,2vw,0.95rem)] leading-[1.05] text-balance whitespace-normal md:text-[0.98rem] lg:text-[1.08rem]">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 overflow-hidden border border-[#eadfcd] bg-[#f8f4ee] lg:hidden">
            <div className="relative aspect-2/1 overflow-hidden">
              <Image
                key={`${pillar.title}-${galleryIndex}-mobile-hero`}
                src={currentGallery[galleryIndex].image}
                alt={`${pillar.title} - ${currentGallery[galleryIndex].label}`}
                fill
                sizes="100vw"
                className="object-cover"
                quality={60}
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#18120d]/86 via-[#18120d]/24 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-white/72 uppercase">
                  {pillar.eyebrow}
                </p>
                <div className="mt-1.5 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-serif text-[1.55rem] leading-none text-white">
                      {pillar.title}
                    </p>
                    <p className="mt-1 text-[0.88rem] leading-5 text-white/82">
                      {currentGallery[galleryIndex].label}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#eadfcd] bg-white px-3.5 py-2.5">
              <div className="flex gap-1.5">
                {currentGallery.map((item, index) => (
                  <button
                    key={`${item.label}-${index}-mobile-top`}
                    type="button"
                    onClick={() => setGalleryIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === galleryIndex ? "w-8 bg-[#8b7453]" : "w-2 bg-[#d7cab9]"
                    }`}
                    aria-label={`Show ${item.label}`}
                  />
                ))}
              </div>
              <p className="text-[0.72rem] font-semibold tracking-[0.2em] text-[#8b7453] uppercase">
                {galleryIndex + 1} / {currentGallery.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 pt-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-7 lg:pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-125"
              >
                <p className="hidden text-[0.82rem] font-semibold tracking-[0.08em] text-[#8b7453] uppercase md:text-[0.95rem] lg:block">
                  {pillar.eyebrow}
                </p>
                <p className="text-body text-ink-light text-[0.95rem] leading-6.5 md:mt-5 md:text-base md:leading-8 lg:mt-4">
                  {pillar.desc}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 md:hidden">
                  {pillar.bullets.slice(0, 4).map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="bg-gold mt-[0.48rem] h-1.5 w-1.5 shrink-0 rounded-full" />
                      <p className="text-[0.88rem] leading-5.5 text-[#5f5448]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 hidden grid-cols-2 gap-x-4 gap-y-2 md:mt-6 md:grid md:gap-x-8 md:gap-y-3">
                  {pillar.bullets.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="bg-gold mt-[0.48rem] h-1.5 w-1.5 shrink-0 rounded-full" />
                      <p className="text-[0.88rem] leading-5.5 text-[#5f5448] md:text-[0.98rem] md:leading-7">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setPage(pillar.page)}
                  className="text-ink mt-5 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors hover:text-[#8b7453] md:mt-7 md:text-[11px]"
                >
                  Discover More <ArrowRight size={14} />
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Auto-Rotating Gallery for all pillars */}
            <div className="group relative hidden overflow-hidden border border-[#eadfcd] bg-white md:max-w-88 lg:block lg:max-w-none">
                <div className="relative aspect-4/5 overflow-hidden">
                  <motion.div
                    className="flex h-full"
                    animate={{ x: `-${galleryIndex * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {currentGallery.map((item) => (
                      <div
                        key={item.image}
                        className="min-w-full h-full relative"
                      >
                        <Image
                          src={item.image}
                          alt={item.label}
                          fill
                          sizes="18rem"
                          className="object-cover"
                          quality={60}
                          loading="lazy"
                        />
                        {/* Text Label Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white font-serif text-lg md:text-xl"
                             style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
                          >
                            {item.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30">
                    <motion.div
                      key={galleryIndex}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                      className="h-full bg-white"
                    />
                  </div>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {currentGallery.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        className={`h-1.5 w-1.5 rounded-full transition-all ${
                          i === galleryIndex ? "bg-white scale-125" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </FadeInView>
    </section>
  );
};
