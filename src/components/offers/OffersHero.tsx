"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

const OFFER_IMAGE =
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/a9e7a6fc-d05e-4f9f-68a5-db22e0b59800/public";

export function OffersHero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const contentY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -58]), {
    stiffness: 96,
    damping: 26,
    mass: 0.42,
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0.72]);

  return (
    <section
      ref={heroRef}
      className="border-gold/30 relative h-[88vh] overflow-hidden border-y md:h-[90vh]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="fixed inset-x-0 top-0 h-screen">
          <img
            src={OFFER_IMAGE}
            alt="TS Residence offers"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/44" />
          <div className="absolute inset-0 bg-linear-to-b from-black/38 via-black/18 to-black/54" />
        </div>
      </div>

      <div className="relative h-full" />

      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center px-5 text-center md:px-12 lg:px-20 xl:px-28"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="w-full max-w-4xl text-white">
          <div data-reveal-group="0.1">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.14, ease: "easeOut" }}
              className="via-gold/70 mx-auto h-px w-24 origin-center bg-linear-to-r from-transparent to-transparent"
            />

            <div className="mt-6 space-y-2 md:space-y-3">
              <span className="block font-serif text-[0.95rem] leading-[1.16] font-light tracking-[-0.02em] whitespace-nowrap text-white sm:text-[1.1rem] md:text-[1.7rem] lg:text-[2.2rem]">
                Built inside TS Suites, with wellness,
              </span>
              <span className="block font-serif text-[0.95rem] leading-[1.16] font-light tracking-[-0.02em] whitespace-nowrap text-white sm:text-[1.1rem] md:text-[1.7rem] lg:text-[2.2rem]">
                community, and flexible ways to stay.
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
