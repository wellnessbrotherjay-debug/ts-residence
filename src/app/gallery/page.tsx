"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useTransition } from "react";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";

type GalleryCollection = {
  name: string;
  handle: string;
  description: string;
  cover: string;
  images: string[];
};

const collections: GalleryCollection[] = [
  {
    name: "TS Residence",
    handle: "@tsresidences",
    description: "Architectural moments and signature spaces in Seminyak.",
    cover:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp",
    images: [
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp",
      "https://tsresidence.id/wp-content/uploads/2025/08/ts-residence-img.webp",
      "https://tsresidence.id/wp-content/uploads/2025/09/tssuites-pool-sunset.webp",
      "https://tsresidence.id/wp-content/uploads/2025/09/46cef01afe76ce46f8019d0f518ea165.jpg",
    ],
  },
  {
    name: "Apartments",
    handle: "@tsresidences",
    description: "SOLO, STUDIO, and SOHO apartment perspectives.",
    cover:
      "https://tsresidence.id/wp-content/uploads/2025/08/studio-main-image.webp",
    images: [
      "https://tsresidence.id/wp-content/uploads/2025/08/solo-main-image.webp",
      "https://tsresidence.id/wp-content/uploads/2025/08/studio-main-image.webp",
      "https://tsresidence.id/wp-content/uploads/2025/08/soho-main-image.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp",
    ],
  },
  {
    name: "Five-Star Living",
    handle: "@tssuitesseminyak",
    description: "Curated facilities and service-led lifestyle details.",
    cover:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-suites-coworking-space-red-dress-woman-scaled.webp",
    images: [
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-suites-coworking-space-red-dress-woman-scaled.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/christophe-salon-img-scaled-e1759999189370.webp",
      "https://tsresidence.id/wp-content/uploads/2025/09/tstore-designer-hub-ts-residence.webp",
      "https://tsresidence.id/wp-content/uploads/2025/09/tsbar-seminyak.webp",
    ],
  },
  {
    name: "Healthy Living",
    handle: "@nolwellnessclub",
    description: "Wellness routines, classes, and restorative facilities.",
    cover:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tsc-yoga-class.webp",
    images: [
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tsc-yoga-class.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tsc-community-scaled.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-reformer-pilater.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/massage-room.webp",
    ],
  },
  {
    name: "Easy Living",
    handle: "@tsresidences",
    description: "Everyday ease, location access, and monthly-stay rhythm.",
    cover:
      "https://tsresidence.id/wp-content/uploads/2025/08/woman-bathing-at-TS-suite-rooftop-pool-during-a-beautiful-sunset.webp",
    images: [
      "https://tsresidence.id/wp-content/uploads/2025/08/woman-bathing-at-TS-suite-rooftop-pool-during-a-beautiful-sunset.webp",
      "https://tsresidence.id/wp-content/uploads/2025/08/panoramic-view-of-sunset-on-a-beah-near-tsresidence-scaled.webp",
      "https://tsresidence.id/wp-content/uploads/2025/09/46cef01afe76ce46f8019d0f518ea165.jpg",
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp",
    ],
  },
];

const officialAccounts = [
  {
    name: "TS Residence",
    handle: "@tsresidences",
    href: "https://www.instagram.com/tsresidences/",
    logo: "https://tsresidence.id/wp-content/uploads/2025/08/ts-residence-logo.webp",
  },
  {
    name: "TS Suites",
    handle: "@tssuitesseminyak",
    href: "https://www.instagram.com/tssuitesseminyak/",
    logo: "https://tsresidence.id/wp-content/uploads/2025/08/ts-suites-logo.webp",
  },
  {
    name: "TS Social Club",
    handle: "@ts_social_club",
    href: "https://www.instagram.com/ts_social_club/",
    logo: "https://tsresidence.id/wp-content/uploads/2025/08/tsc-logo.webp",
  },
  {
    name: "No.1 Wellness Club",
    handle: "@no.1wellnessclub",
    href: "https://www.instagram.com/no.1wellnessclub",
    logo: "https://tsresidence.id/wp-content/uploads/2025/09/no-1-wellness-club-logo.webp",
  },
];

export default function Page() {
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [isPending, startTransition] = useTransition();
  const [activeCollection, setActiveCollection] = useState<number>(-1);
  const [activeImage, setActiveImage] = useState<number>(-1);

  const allImages = collections.flatMap((collection) =>
    collection.images.map((src) => ({ src, collection: collection.name })),
  );

  const filteredImages =
    selectedCollection === "All"
      ? allImages
      : allImages.filter((item) => item.collection === selectedCollection);

  useEffect(() => {
    if (activeCollection < 0 || activeImage < 0) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveCollection(-1);
        setActiveImage(-1);
      }
      if (event.key === "ArrowRight") {
        setActiveImage(
          (prev) => (prev + 1) % collections[activeCollection].images.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setActiveImage(
          (prev) =>
            (prev - 1 + collections[activeCollection].images.length) %
            collections[activeCollection].images.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCollection, activeImage]);

  return (
    <div className="bg-cream overflow-x-hidden">
      <section className="border-gold/30 relative min-h-[56vh] overflow-hidden border-y md:min-h-[72vh] lg:min-h-[86vh]">
        <img
          src="https://tsresidence.id/wp-content/uploads/2025/08/ts-residence-img.webp"
          alt="TS Residence Gallery"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/52 via-black/34 to-black/66" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_82%_80%,rgba(196,160,96,0.2),transparent_52%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-black/62 to-transparent" />

        <div className="relative flex min-h-[56vh] w-full items-center justify-center px-6 py-18 text-center md:min-h-[72vh] md:px-12 md:py-22 lg:min-h-[86vh] lg:px-20 lg:py-24 xl:px-28">
          <FadeInView className="w-full max-w-300 text-white">
            <div className="border-gold/45 inline-flex flex-col items-center gap-1 border bg-black/58 px-5 py-2 sm:flex-row sm:gap-3 sm:py-2.5">
              <span className="text-gold-light text-[11px] font-semibold tracking-[0.24em] uppercase">
                Gallery
              </span>
              <span className="relative hidden h-2 w-2 sm:flex">
                <span className="bg-gold-light absolute inline-flex h-full w-full animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full opacity-75" />
                <span className="bg-gold-light relative inline-flex h-2 w-2 rounded-full" />
              </span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-white/95 uppercase sm:text-[11px]">
                Visual Journey
              </span>
            </div>

            <h1 className="mx-auto mt-8 max-w-[14ch] font-serif text-[3.2rem] leading-[0.9] tracking-[-0.03em] text-white sm:text-7xl md:text-[5.7rem] lg:text-[6.8rem]">
              Moments that define
              <br />
              life at TS Residence.
            </h1>

            <p className="mx-auto mt-9 max-w-190 text-[1.08rem] leading-8 text-white/92 [text-shadow:0_2px_18px_rgba(0,0,0,0.38)] md:text-[1.16rem] md:leading-9">
              Explore apartment ambiance, five-star facilities, wellness
              culture, and everyday long-stay experiences in Seminyak.
            </p>

            <div className="via-gold/55 mx-auto mt-9 h-px w-full max-w-115 bg-linear-to-r from-transparent to-transparent" />
          </FadeInView>
        </div>
      </section>

      <section className="border-gold/30 border-b bg-white">
        <div className="mx-auto w-full max-w-440 px-6 py-16 md:px-10 md:py-18 lg:px-12 lg:py-22 xl:px-14">
          <FadeInView className="mb-14 max-w-255">
            <p className="label-caps text-gold">Official Channels</p>
            <h2 className="text-ink mt-4 font-serif text-[2.3rem] leading-[1.03] md:text-[3.2rem]">
              Explore visual stories from
              <br />
              each TS ecosystem.
            </h2>
          </FadeInView>

          <StaggerContainer
            className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-4"
            staggerDelay={0.12}
          >
            {officialAccounts.map((account) => (
              <StaggerItem
                key={account.name}
                className="border-gold/25 bg-cream border transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(28,25,23,0.08)]"
              >
                <a
                  href={account.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full cursor-pointer items-center gap-4 p-6"
                >
                  <div className="border-gold/30 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border bg-white">
                    <img
                      src={account.logo}
                      alt={account.name}
                      className="h-11 w-11 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-ink font-serif text-[1.4rem] leading-none">
                      {account.name}
                    </p>
                    <p className="text-ink/60 mt-2 text-[11px] tracking-[0.2em] uppercase">
                      {account.handle}
                    </p>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeInView className="mb-12 max-w-270">
            <p className="label-caps text-gold">Collections</p>
            <h2 className="text-ink mt-4 font-serif text-[2.3rem] leading-[1.03] md:text-[3.2rem]">
              Curated visual sets from
              <br />
              each lifestyle experience.
            </h2>
          </FadeInView>

          <StaggerContainer
            className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3"
            staggerDelay={0.12}
          >
            {collections.map((collection, collectionIndex) => (
              <StaggerItem
                key={collection.name}
                className="group border-gold/25 bg-cream overflow-hidden border"
              >
                <button
                  onClick={() => {
                    setActiveCollection(collectionIndex);
                    setActiveImage(0);
                  }}
                  className="block h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left"
                >
                  <div className="overflow-hidden">
                    <img
                      src={collection.cover}
                      alt={collection.name}
                      className="h-65 w-full object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.05] md:h-75"
                    />
                  </div>
                  <div className="p-6 md:p-7">
                    <div className="flex items-center justify-between">
                      <p className="text-ink font-serif text-[2rem] leading-none">
                        {collection.name}
                      </p>
                      <span className="label-caps text-gold-dark">
                        {collection.images.length} Photos
                      </span>
                    </div>
                    <p className="text-ink/80 mt-4 text-[1rem] leading-8">
                      {collection.description}
                    </p>
                    <p className="text-ink/55 mt-4 text-[11px] tracking-[0.2em] uppercase">
                      {collection.handle}
                    </p>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-gold/30 bg-cream border-b">
        <div className="w-full px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20 xl:px-14">
          <FadeInView className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="label-caps text-gold">All Moments</p>
              <h3 className="text-ink mt-3 font-serif text-[2rem] leading-[1.03] md:text-[2.7rem]">
                Browse by category.
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", ...collections.map((item) => item.name)].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    startTransition(() => setSelectedCollection(item));
                  }}
                  className={`cursor-pointer border px-4 py-2 text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-500 ${
                    selectedCollection === item
                      ? "border-gold bg-gold text-white"
                      : "border-gold/35 text-ink hover:border-gold hover:text-gold-dark bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </FadeInView>

          <div
            aria-live="polite"
            className={`transition-opacity duration-500 ${isPending ? "opacity-60" : "opacity-100"}`}
          >
            <StaggerContainer
              className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5"
              staggerDelay={0.06}
            >
              {filteredImages.map((item, index) => (
                <StaggerItem
                  key={`${item.src}-${index}`}
                  className="group border-gold/25 overflow-hidden border bg-white"
                >
                  <button
                    onClick={() => {
                      const collectionIndex = collections.findIndex(
                        (collection) =>
                          collection.name === item.collection &&
                          collection.images.includes(item.src),
                      );
                      const imageIndex = collections[
                        collectionIndex
                      ].images.indexOf(item.src);
                      setActiveCollection(collectionIndex);
                      setActiveImage(imageIndex);
                    }}
                    className="relative block h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0"
                  >
                    <img
                      src={item.src}
                      alt={item.collection}
                      className="aspect-video w-full object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.07]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeCollection >= 0 && activeImage >= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-140 flex items-center justify-center bg-black/88 px-4 py-10 md:px-8"
            onClick={() => {
              setActiveCollection(-1);
              setActiveImage(-1);
            }}
          >
            <button
              onClick={() => {
                setActiveCollection(-1);
                setActiveImage(-1);
              }}
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
                    (prev - 1 + collections[activeCollection].images.length) %
                    collections[activeCollection].images.length,
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
                setActiveImage(
                  (prev) =>
                    (prev + 1) % collections[activeCollection].images.length,
                );
              }}
              className="absolute right-2 z-10 h-11 w-11 cursor-pointer border border-white/25 bg-black/30 text-2xl leading-none text-white transition-colors hover:bg-white/15 md:right-6"
              aria-label="Next image"
            >
              ›
            </button>

            <motion.figure
              key={collections[activeCollection].images[activeImage]}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-330"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={collections[activeCollection].images[activeImage]}
                alt={collections[activeCollection].name}
                className="max-h-[82vh] w-full object-contain"
              />
              <figcaption className="mt-4 text-center text-[12px] tracking-[0.18em] text-white/80 uppercase">
                {collections[activeCollection].name} | {activeImage + 1} /{" "}
                {collections[activeCollection].images.length}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
