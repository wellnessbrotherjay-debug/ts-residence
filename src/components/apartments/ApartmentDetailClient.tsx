"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";
import type { ApartmentKey } from "@/lib/apartments-content";
import { apartmentDetailMap } from "@/lib/apartments-content";

const FACILITY_ACCESS = [
  {
    title: "Ice Bath Recovery",
    desc: "Cold recovery facilities are included in the wellness offering.",
    image:
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/b647b00e-7a93-4303-5eec-48df0c08f900/public",
  },
  {
    title: "Sauna Access",
    desc: "Residents also have access to the N°1 sauna spaces.",
    image:
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/ded4da42-07db-420e-7dce-6c7dd3269a00/public",
  },
  {
    title: "Hot Bath Recovery",
    desc: "Hot bath recovery facilities are part of the resident wellness access.",
    image:
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/5ceb6c4a-d753-48c9-835b-e24146174200/public",
  },
  {
    title: "Hotel Gym Access",
    desc: "Use the TS Suites gym as part of your long-stay routine.",
    image:
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/5f27132a-005f-497e-f230-a98ba1b0ae00/public",
  },
  {
    title: "TS Pool Access",
    desc: "Residents also enjoy access to the TS Suites pool facilities.",
    image:
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/2cb9599e-6190-4861-6445-f1bf2c09a500/public",
  },
];

const GALLERY_TITLES: Partial<Record<ApartmentKey, string[]>> = {
  solo: [
    "SOLO Lounge",
    "SOLO Walk-In Cupboard",
    "SOLO Wash Room",
    "SOLO Bed",
    "SOLO Dining Room",
    "SOLO Bathroom",
  ],
};

export function ApartmentDetailClient({ slug }: { slug: ApartmentKey }) {
  const router = useRouter();
  const apartment = apartmentDetailMap[slug];
  const [activeImage, setActiveImage] = useState<number>(-1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const apartmentOrder: ApartmentKey[] = useMemo(
    () => ["solo", "studio", "soho"],
    [],
  );
  const galleryTitles = GALLERY_TITLES[slug] ?? [];
  const currentApartmentIndex = apartmentOrder.indexOf(slug);
  const previousApartment =
    currentApartmentIndex > 0
      ? apartmentOrder[currentApartmentIndex - 1]
      : null;
  const nextApartment =
    currentApartmentIndex < apartmentOrder.length - 1
      ? apartmentOrder[currentApartmentIndex + 1]
      : null;

  const navigateToApartment = (target: ApartmentKey) => {
    if (target === slug) return;
    router.push(`/apartments/${target}`);
  };

  const goToPreviousImage = () => {
    setCarouselIndex(
      (prev) => (prev - 1 + apartment.gallery.length) % apartment.gallery.length,
    );
  };

  const goToNextImage = () => {
    setCarouselIndex((prev) => (prev + 1) % apartment.gallery.length);
  };

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
            <h1 className="mx-auto max-w-[14ch] font-serif text-[3.25rem] leading-[0.9] tracking-[-0.03em] text-white sm:text-7xl md:text-[5.8rem] lg:text-[6.9rem]">
              {apartment.name}
            </h1>

            <p className="mt-5 text-[11px] font-semibold tracking-[0.24em] text-white uppercase sm:text-[12px]">
              {apartment.sqm} | {apartment.bed}
            </p>

            <p className="mx-auto mt-9 max-w-190 text-[1.08rem] leading-8 text-white/92 [text-shadow:0_2px_18px_rgba(0,0,0,0.38)] md:text-[1.16rem] md:leading-9">
              {apartment.short}
            </p>
          </FadeInView>
        </div>

        <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center px-6 md:bottom-8">
          <div className="flex flex-wrap items-center justify-center gap-2 border border-white/18 bg-black/18 px-3 py-3 backdrop-blur-md">
            {previousApartment ? (
              <button
                type="button"
                onClick={() => navigateToApartment(previousApartment)}
                className="flex h-10 w-10 items-center justify-center border border-white/22 bg-black/12 text-lg text-white transition-colors hover:bg-white/12"
                aria-label={`Go to ${apartmentDetailMap[previousApartment].name}`}
              >
                ‹
              </button>
            ) : null}

            {apartmentOrder.map((item) => {
              const itemApartment = apartmentDetailMap[item];
              const isActive = item === slug;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => navigateToApartment(item)}
                  className={`px-4 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase transition-all ${
                    isActive
                      ? "border-gold bg-gold text-ink border"
                      : "border border-white/22 bg-black/12 text-white hover:bg-white/12"
                  }`}
                >
                  {itemApartment.name}
                </button>
              );
            })}

            {nextApartment ? (
              <button
                type="button"
                onClick={() => navigateToApartment(nextApartment)}
                className="flex h-10 w-10 items-center justify-center border border-white/22 bg-black/12 text-lg text-white transition-colors hover:bg-white/12"
                aria-label={`Go to ${apartmentDetailMap[nextApartment].name}`}
              >
                ›
              </button>
            ) : null}
          </div>
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
          </FadeInView>

          <FadeInView direction="none">
            <div className="border-gold/25 overflow-hidden border bg-white shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="relative overflow-hidden bg-[#f6f0e6]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_42%),linear-gradient(180deg,rgba(22,18,14,0.04),rgba(22,18,14,0.18))]" />

                  <div className="relative aspect-[4/5] min-h-[24rem] md:aspect-[16/10] md:min-h-[34rem] lg:min-h-[42rem]">
                    <AnimatePresence mode="wait">
                      <motion.button
                        key={apartment.gallery[carouselIndex]}
                        type="button"
                        initial={{ opacity: 0, scale: 1.04, x: 24 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.985, x: -24 }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => setActiveImage(carouselIndex)}
                        className="absolute inset-0 block h-full w-full cursor-zoom-in appearance-none border-0 bg-transparent p-0 text-left"
                      >
                        <img
                          src={apartment.gallery[carouselIndex]}
                          alt={`${apartment.name} ${carouselIndex + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </motion.button>
                    </AnimatePresence>

                    <div className="absolute inset-y-0 right-0 left-0 flex items-center justify-between px-3 md:px-5">
                      <button
                        type="button"
                        onClick={goToPreviousImage}
                        className="flex h-11 w-11 items-center justify-center border border-white/18 bg-black/18 text-xl text-white backdrop-blur-md transition-all hover:bg-white/18 md:h-13 md:w-13 md:text-2xl"
                        aria-label="Previous gallery image"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={goToNextImage}
                        className="flex h-11 w-11 items-center justify-center border border-white/18 bg-black/18 text-xl text-white backdrop-blur-md transition-all hover:bg-white/18 md:h-13 md:w-13 md:text-2xl"
                        aria-label="Next gallery image"
                      >
                        ›
                      </button>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-black/68 via-black/18 to-transparent px-5 py-5 md:px-7 md:py-6">
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.24em] text-white/74 uppercase">
                          Apartment Gallery
                        </p>
                        <p className="mt-2 font-serif text-[1.55rem] leading-none text-white md:text-[2rem]">
                          {apartment.name} Residence
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveImage(carouselIndex)}
                        className="border border-white/28 bg-white/10 px-4 py-2 text-[11px] font-semibold tracking-[0.2em] text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/18"
                      >
                        Open
                      </button>
                    </div>

                    <div className="absolute top-4 right-4 left-4 flex items-center justify-between md:top-6 md:right-6 md:left-6">
                      <div className="border border-white/18 bg-black/18 px-3 py-2 text-[11px] tracking-[0.22em] text-white/86 uppercase backdrop-blur-md">
                        {String(carouselIndex + 1).padStart(2, "0")} /{" "}
                        {String(apartment.gallery.length).padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-gold/20 bg-[#fcfaf6] p-5 md:p-6">
                  <div className="space-y-3">
                    {apartment.gallery.map((image, index) => {
                      const isActive = index === carouselIndex;
                      const galleryTitle =
                        galleryTitles[index] ?? `${apartment.name} Interior`;

                      return (
                        <button
                          key={image}
                          type="button"
                          onClick={() => setCarouselIndex(index)}
                          className={`group grid w-full grid-cols-[5.25rem_1fr] gap-3 border p-2 text-left transition-all duration-300 ${
                            isActive
                              ? "border-gold/55 bg-white shadow-[0_16px_34px_rgba(28,25,23,0.08)]"
                              : "border-[#eadfcd] bg-transparent hover:border-gold/40 hover:bg-white/70"
                          }`}
                          aria-label={`Show ${apartment.name} image ${index + 1}`}
                        >
                          <div className="overflow-hidden bg-[#efe5d5]">
                            <img
                              src={image}
                              alt={`${apartment.name} thumbnail ${index + 1}`}
                              className="h-20 w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                            />
                          </div>
                          <div className="flex min-w-0 flex-col justify-center">
                            <p className="mt-1 font-serif text-[1.1rem] leading-6 text-[#2b2218]">
                              {galleryTitle}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex gap-2">
                    {apartment.gallery.map((image, index) => (
                      <button
                        key={`${image}-progress`}
                        type="button"
                        onClick={() => setCarouselIndex(index)}
                        className="flex-1"
                        aria-label={`Jump to gallery image ${index + 1}`}
                      >
                        <span className="block h-1.5 w-full overflow-hidden bg-[#e7ddce]">
                          <motion.span
                            animate={{
                              width: index === carouselIndex ? "100%" : "0%",
                              opacity: index === carouselIndex ? 1 : 0.45,
                            }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            className="bg-gold block h-full"
                          />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      <section className="border-gold/30 border-b bg-[#fbf8f2]">
        <div className="mx-auto w-full max-w-440 px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20 xl:px-14">
          <FadeInView className="mb-10 max-w-250">
            <p className="label-caps text-gold">Resident Access</p>
            <h3 className="text-ink mt-4 font-serif text-[2.15rem] leading-[1.02] md:text-[2.9rem]">
              Every apartment also includes access to hotel wellness
              facilities.
            </h3>
            <p className="text-ink/78 mt-5 max-w-[68ch] text-[1.04rem] leading-8">
              Alongside your private apartment, residents can use TS Suites and
              N°1 recovery facilities including ice bath, sauna, hot bath, gym,
              and pool access.
            </p>
          </FadeInView>

          <StaggerContainer
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5"
            staggerDelay={0.1}
          >
            {FACILITY_ACCESS.map((item) => (
              <StaggerItem
                key={item.title}
                className="group border-gold/20 overflow-hidden border bg-white"
              >
                <div className="overflow-hidden bg-[#efe6d8]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <p className="label-caps text-gold-dark">Included Access</p>
                  <p className="text-ink mt-3 font-serif text-[1.45rem] leading-[1.05]">
                    {item.title}
                  </p>
                  <p className="text-ink/72 mt-3 text-[0.98rem] leading-7">
                    {item.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
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
            <motion.figure
              key={apartment.gallery[activeImage]}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-330"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImage(
                    (prev) =>
                      (prev - 1 + apartment.gallery.length) %
                      apartment.gallery.length,
                  );
                }}
                className="absolute top-1/2 left-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-black/22 text-[2rem] leading-none text-white shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/16 md:left-6 md:h-14 md:w-14"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImage((prev) => (prev + 1) % apartment.gallery.length);
                }}
                className="absolute top-1/2 right-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-black/22 text-[2rem] leading-none text-white shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/16 md:right-6 md:h-14 md:w-14"
                aria-label="Next image"
              >
                ›
              </button>
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
