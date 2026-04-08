"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useTransition } from "react";
import { LockedPageHero } from "@/components/site/LockedPageHero";
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
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/c7d7a14d-6caa-4eaa-dd61-26a5f852f900/public",
    images: [
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/52b605cf-2c98-48f3-cce2-b317f0dbd800/public",
      "https://tsresidence.id/wp-content/uploads/2025/08/studio-main-image.webp",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/2fef14ff-25f6-41d7-e15e-b19d9b793100/public",
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
    logo: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/cce3ff72-a0c2-4b10-826e-c47befe5db00/public",
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
    <div className="relative isolate overflow-x-hidden">
      <LockedPageHero
        image="https://tsresidence.id/wp-content/uploads/2025/08/ts-residence-img.webp"
        alt="TS Residence Gallery"
        heightClassName="h-[86vh] md:h-[88vh]"
        title={
          <>
            Moments that define
            <br />
            life at TS Residence.
          </>
        }
        description="Explore apartment ambiance, five-star facilities, wellness culture, and everyday long-stay experiences in Seminyak."
      />

      <section className="border-gold/30 relative z-10 border-b bg-white">
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

      <section className="border-gold/30 bg-cream relative z-10 border-b">
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

            <figure
              key={collections[activeCollection].images[activeImage]}
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
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
