"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";
import type { ApartmentKey } from "@/lib/apartments-content";
import { apartmentDetailMap } from "@/lib/apartments-content";

export function ApartmentDetailClient({ slug }: { slug: ApartmentKey }) {
  const apartment = apartmentDetailMap[slug];
  const [activeImage, setActiveImage] = useState<number>(-1);

  useEffect(() => {
    if (activeImage < 0) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(-1);
      if (event.key === "ArrowRight") {
        setActiveImage((prev) => (prev + 1) % apartment.gallery.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveImage(
          (prev) =>
            (prev - 1 + apartment.gallery.length) % apartment.gallery.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeImage, apartment.gallery.length]);

  return (
    <div className="bg-cream overflow-x-hidden">
      <section className="border-gold/30 relative min-h-[56vh] overflow-hidden border-y md:min-h-[72vh] lg:min-h-[86vh]">
        <img
          src={apartment.hero}
          alt={`${apartment.name} Apartment`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/52 via-black/34 to-black/66" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_82%_80%,rgba(196,160,96,0.2),transparent_52%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-black/62 to-transparent" />

        <div className="relative flex min-h-[56vh] w-full items-center justify-center px-6 py-18 text-center md:min-h-[72vh] md:px-12 md:py-22 lg:min-h-[86vh] lg:px-20 lg:py-24 xl:px-28">
          <FadeInView className="w-full max-w-300 text-white">
            <div className="border-gold/45 inline-flex flex-col items-center gap-1 border bg-black/58 px-5 py-2 sm:flex-row sm:gap-3 sm:py-2.5">
              <span className="text-gold-light text-[11px] font-semibold tracking-[0.24em] uppercase">
                Apartment
              </span>
              <span className="relative hidden h-2 w-2 sm:flex">
                <span className="bg-gold-light absolute inline-flex h-full w-full animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full opacity-75" />
                <span className="bg-gold-light relative inline-flex h-2 w-2 rounded-full" />
              </span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-white/95 uppercase sm:text-[11px]">
                {apartment.sqm} | {apartment.bed}
              </span>
            </div>

            <h1 className="mx-auto mt-8 max-w-[14ch] font-serif text-[3.25rem] leading-[0.9] tracking-[-0.03em] text-white sm:text-7xl md:text-[5.8rem] lg:text-[6.9rem]">
              {apartment.name}
            </h1>

            <p className="mx-auto mt-9 max-w-190 text-[1.08rem] leading-8 text-white/92 [text-shadow:0_2px_18px_rgba(0,0,0,0.38)] md:text-[1.16rem] md:leading-9">
              {apartment.short}
            </p>
          </FadeInView>
        </div>
      </section>

      <section className="border-gold/30 border-b bg-white">
        <div className="mx-auto w-full max-w-440 px-6 py-16 md:px-10 md:py-18 lg:px-12 lg:py-22 xl:px-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
            <FadeInView className="border-gold/35 border bg-white p-7 shadow-[0_20px_44px_rgba(25,23,20,0.06)] md:p-10 lg:p-12">
              <p className="label-caps text-gold">Overview</p>
              <h2 className="text-ink mt-5 font-serif text-[2.35rem] leading-[0.98] md:text-[3.2rem] lg:text-[3.6rem]">
                Designed for
                <br />
                monthly comfort.
              </h2>
              <p className="text-ink/88 mt-7 max-w-[58ch] text-[1.12rem] leading-9">
                {apartment.description}
              </p>
              <div className="mt-10 flex flex-wrap gap-4 md:gap-5">
                <Link
                  href="/contact"
                  className="border-gold bg-gold hover:bg-gold-dark inline-flex min-h-13.5 items-center justify-center border px-9 py-4 text-[12px] font-semibold tracking-[0.22em] text-white uppercase transition-all duration-400"
                >
                  Book Apartment
                </Link>
                <Link
                  href="/offers"
                  className="border-ink/35 bg-ink hover:bg-ink/90 inline-flex min-h-13.5 items-center justify-center border px-9 py-4 text-[12px] font-semibold tracking-[0.22em] text-white uppercase transition-all duration-400"
                >
                  View Offers
                </Link>
              </div>
            </FadeInView>

            <FadeInView className="border-gold/25 bg-cream border p-6 md:p-8">
              <p className="label-caps text-gold">Key Features</p>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
                {apartment.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="bg-gold h-1.5 w-1.5 shrink-0 rounded-full" />
                    <span className="text-ink/82 text-[1.02rem] leading-8">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </FadeInView>
          </div>
        </div>
      </section>

      <section className="border-gold/30 bg-cream border-b">
        <div className="w-full px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20 xl:px-14">
          <FadeInView className="mb-10 max-w-245">
            <p className="label-caps text-gold">Gallery</p>
            <h3 className="text-ink mt-3 font-serif text-[2.2rem] leading-[1.03] md:text-[3rem]">
              Visual details of {apartment.name}.
            </h3>
          </FadeInView>

          <StaggerContainer
            className="space-y-4 md:space-y-5"
            staggerDelay={0.1}
          >
            <div className="md:hidden">
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {apartment.gallery.map((image, index) => (
                  <StaggerItem
                    key={image}
                    className={`group border-gold/25 shrink-0 snap-center overflow-hidden border bg-white ${
                      index === 0 ? "w-[88vw]" : "w-[76vw]"
                    }`}
                  >
                    <button
                      onClick={() => setActiveImage(index)}
                      className="relative block h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0"
                    >
                      <img
                        src={image}
                        alt={`${apartment.name} ${index + 1}`}
                        className={`w-full object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.05] ${
                          index === 0
                            ? "h-[60vw] min-h-80"
                            : "h-[52vw] min-h-65"
                        }`}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/6 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </button>
                  </StaggerItem>
                ))}
              </div>
            </div>

            <div className="hidden md:block">
              <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12">
                <StaggerItem className="group border-gold/25 overflow-hidden border bg-white lg:col-span-8">
                  <button
                    onClick={() => setActiveImage(0)}
                    className="relative block h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0"
                  >
                    <img
                      src={apartment.gallery[0]}
                      alt={`${apartment.name} 1`}
                      className="h-115 w-full object-cover transition-transform duration-1800 ease-out group-hover:scale-[1.045] lg:h-155"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/42 via-black/6 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </button>
                </StaggerItem>

                <div className="grid grid-cols-2 gap-4 md:gap-5 lg:col-span-4 lg:grid-cols-1">
                  {apartment.gallery.slice(1, 3).map((image, index) => (
                    <StaggerItem
                      key={image}
                      className="group border-gold/25 overflow-hidden border bg-white"
                    >
                      <button
                        onClick={() => setActiveImage(index + 1)}
                        className="relative block h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0"
                      >
                        <img
                          src={image}
                          alt={`${apartment.name} ${index + 2}`}
                          className="h-70 w-full object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.055] lg:h-75"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </button>
                    </StaggerItem>
                  ))}
                </div>
              </div>

              {apartment.gallery.length > 3 && (
                <div className="mt-4 grid grid-cols-2 gap-4 md:gap-5 lg:mt-5 lg:grid-cols-12">
                  {apartment.gallery.slice(3).map((image, index) => (
                    <StaggerItem
                      key={image}
                      className="group border-gold/25 overflow-hidden border bg-white lg:col-span-6"
                    >
                      <button
                        onClick={() => setActiveImage(index + 3)}
                        className="relative block h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0"
                      >
                        <img
                          src={image}
                          alt={`${apartment.name} ${index + 4}`}
                          className="h-80 w-full object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.06] lg:h-90"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </button>
                    </StaggerItem>
                  ))}
                </div>
              )}
            </div>
          </StaggerContainer>
        </div>
      </section>

      <AnimatePresence>
        {activeImage >= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-140 flex items-center justify-center bg-black/88 px-4 py-10 md:px-8"
            onClick={() => setActiveImage(-1)}
          >
            <button
              onClick={() => setActiveImage(-1)}
              className="absolute top-4 right-4 z-10 h-11 w-11 cursor-pointer border border-white/30 bg-black/30 text-2xl leading-none text-white transition-colors hover:bg-white/15 md:top-6 md:right-6"
              aria-label="Close gallery"
            >
              ×
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setActiveImage(
                  (prev) =>
                    (prev - 1 + apartment.gallery.length) %
                    apartment.gallery.length,
                );
              }}
              className="absolute left-2 z-10 h-11 w-11 cursor-pointer border border-white/25 bg-black/30 text-2xl leading-none text-white transition-colors hover:bg-white/15 md:left-6"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setActiveImage((prev) => (prev + 1) % apartment.gallery.length);
              }}
              className="absolute right-2 z-10 h-11 w-11 cursor-pointer border border-white/25 bg-black/30 text-2xl leading-none text-white transition-colors hover:bg-white/15 md:right-6"
              aria-label="Next image"
            >
              ›
            </button>
            <motion.figure
              key={apartment.gallery[activeImage]}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-330"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={apartment.gallery[activeImage]}
                alt={apartment.name}
                className="max-h-[82vh] w-full object-contain"
              />
              <figcaption className="mt-4 text-center text-[12px] tracking-[0.18em] text-white/80 uppercase">
                {apartment.name} | {activeImage + 1} /{" "}
                {apartment.gallery.length}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
