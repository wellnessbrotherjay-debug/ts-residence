"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";
import { BTN_DARK, BTN_GOLD } from "@/components/site/buttons";

const easePillars = [
  {
    title: "Location",
    stat: "08 min",
    description:
      "Prime Seminyak location with fast access to beaches, restaurants, and core daily destinations.",
  },
  {
    title: "Flexibility",
    stat: "Monthly",
    description:
      "Built for long-stay residents with adaptable terms and practical arrangements for real life.",
  },
  {
    title: "Support",
    stat: "24/7",
    description:
      "Dedicated team and services to keep your monthly stay efficient, comfortable, and frictionless.",
  },
];

const apartmentTypes = [
  {
    name: "SOLO",
    area: "36 sqm",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/08/solo-main-image.webp",
    description:
      "A compact and refined residence for independent living with complete essentials.",
    href: "/apartments/solo",
  },
  {
    name: "STUDIO",
    area: "48 sqm",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/08/studio-main-image.webp",
    description:
      "A spacious one-bedroom layout balancing comfort, productivity, and privacy.",
    href: "/apartments/studio",
  },
  {
    name: "SOHO",
    area: "80 sqm",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/08/soho-main-image.webp",
    description:
      "Two-bedroom long-stay option for families or residents who need maximum room.",
    href: "/apartments/soho",
  },
];

const easyMoments = [
  "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp",
  "https://tsresidence.id/wp-content/uploads/2025/08/panoramic-view-of-sunset-on-a-beah-near-tsresidence-scaled.webp",
  "https://tsresidence.id/wp-content/uploads/2025/08/woman-bathing-at-TS-suite-rooftop-pool-during-a-beautiful-sunset.webp",
  "https://tsresidence.id/wp-content/uploads/2025/09/46cef01afe76ce46f8019d0f518ea165.jpg",
];

export default function Page() {
  const [galleryIndex, setGalleryIndex] = useState<number>(-1);
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useSpring(useTransform(heroProgress, [0, 1], [0, 110]), {
    stiffness: 80,
    damping: 22,
    mass: 0.4,
  });
  const heroImageScale = useSpring(
    useTransform(heroProgress, [0, 1], [1, 1.08]),
    {
      stiffness: 90,
      damping: 24,
      mass: 0.45,
    },
  );
  const heroContentY = useSpring(useTransform(heroProgress, [0, 1], [0, -36]), {
    stiffness: 95,
    damping: 26,
    mass: 0.42,
  });
  const heroContentOpacity = useTransform(heroProgress, [0, 0.85], [1, 0.76]);

  useEffect(() => {
    if (galleryIndex < 0) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGalleryIndex(-1);
      if (event.key === "ArrowRight") {
        setGalleryIndex((prev) => (prev + 1) % easyMoments.length);
      }
      if (event.key === "ArrowLeft") {
        setGalleryIndex(
          (prev) => (prev - 1 + easyMoments.length) % easyMoments.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [galleryIndex]);

  return (
    <div className="overflow-x-hidden bg-cream">
      <section
        ref={heroRef}
        className="relative min-h-[78vh] overflow-hidden border-y border-gold/30 md:min-h-[92vh]"
      >
        <motion.img
          src="https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp"
          alt="Easy Living at TS Residence"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ y: heroImageY, scale: heroImageScale }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/52 via-black/34 to-black/64" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(196,160,96,0.18),transparent_52%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-black/62 to-transparent" />

        <motion.div
          className="relative flex min-h-[78vh] w-full items-center justify-center px-6 py-18 text-center md:min-h-[92vh] md:px-12 md:py-22 lg:px-20 lg:py-24 xl:px-28"
          style={{ y: heroContentY, opacity: heroContentOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[1200px] text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-flex items-center gap-3 border border-gold/45 bg-black/58 px-5 py-2.5"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-light">
                Easy Living
              </span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gold-light opacity-75 [animation:ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/95">
                Long-Stay Simplicity
              </span>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
              className="mx-auto mt-7 h-px w-28 origin-center bg-gradient-to-r from-transparent via-gold/80 to-transparent"
            />

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.15,
                delay: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto mt-7 max-w-[14.5ch] font-serif text-[3.4rem] leading-[0.9] tracking-[-0.03em] sm:text-7xl md:text-[6.2rem] lg:text-[7.3rem]"
            >
              Stay longer
              <br />
              with less friction,
              <br />
              more quality.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto mt-9 max-w-[760px] text-[1.08rem] leading-8 text-white/92 [text-shadow:0_2px_18px_rgba(0,0,0,0.38)] md:text-[1.16rem] md:leading-9"
            >
              Easy Living is designed for monthly residents who need smooth
              logistics, reliable support, and a residence standard that feels
              premium every day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.62,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto mt-7 grid max-w-[760px] grid-cols-1 gap-3 text-[11px] uppercase tracking-[0.2em] text-white/78 sm:grid-cols-3"
            >
              <span>Prime Location</span>
              <span>Flexible Terms</span>
              <span>Operational Ease</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-b border-gold/30 bg-white">
        <div className="section-shell px-6 py-16 md:px-12 md:py-18 lg:px-20 lg:py-22 xl:px-28">
          <StaggerContainer
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5"
            staggerDelay={0.16}
          >
            {easePillars.map((item) => (
              <StaggerItem
                key={item.title}
                className="group border border-gold/25 bg-cream px-6 py-7 transition-all duration-[900ms] hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(28,25,23,0.1)] md:px-7 md:py-8"
              >
                <div className="flex items-center justify-between">
                  <p className="label-caps text-gold-dark">{item.title}</p>
                  <span className="font-serif text-[1.35rem] text-gold/70 transition-all duration-700 group-hover:translate-x-1 group-hover:text-gold-dark">
                    {item.stat}
                  </span>
                </div>
                <div className="mt-4 h-px w-full bg-gradient-to-r from-gold/30 via-gold/15 to-transparent" />
                <p className="mt-5 text-[1rem] leading-8 text-ink/80">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-b border-gold/30 bg-cream">
        <div className="w-full px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <FadeInView
              direction="left"
              className="overflow-hidden border border-gold/25"
            >
              <motion.img
                src="https://tsresidence.id/wp-content/uploads/2025/08/panoramic-view-of-sunset-on-a-beah-near-tsresidence-scaled.webp"
                alt="Seminyak beach near TS Residence"
                className="h-full min-h-[360px] w-full object-cover"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </FadeInView>
            <FadeInView
              direction="right"
              className="flex items-center border border-gold/25 bg-white px-6 py-10 md:px-10 lg:px-12"
            >
              <div className="max-w-[40rem]">
                <p className="label-caps text-gold">Strategic Access</p>
                <h2 className="mt-5 font-serif text-[2.25rem] leading-[1.03] tracking-[-0.03em] text-ink md:text-[3rem]">
                  Live close to what matters,
                  <br />
                  move through Bali faster.
                </h2>
                <p className="mt-6 text-[1.03rem] leading-8 text-ink/80 md:text-[1.1rem]">
                  Positioned in Seminyak with direct connectivity to beach
                  areas, lifestyle hubs, and practical daily destinations. Easy
                  Living is built around better day-to-day flow.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-gold/25 pt-6">
                  <div>
                    <p className="label-caps text-ink/55">Seminyak Beach</p>
                    <p className="mt-2 font-serif text-3xl text-ink">8 min</p>
                  </div>
                  <div>
                    <p className="label-caps text-ink/55">Sunset Road</p>
                    <p className="mt-2 font-serif text-3xl text-ink">5 min</p>
                  </div>
                  <div>
                    <p className="label-caps text-ink/55">Dining & Cafes</p>
                    <p className="mt-2 font-serif text-3xl text-ink">Nearby</p>
                  </div>
                  <div>
                    <p className="label-caps text-ink/55">Support Services</p>
                    <p className="mt-2 font-serif text-3xl text-ink">Daily</p>
                  </div>
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      <section className="w-full border-b border-gold/30 bg-white px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20 xl:px-14">
        <FadeInView className="mx-auto max-w-[980px] text-center">
          <p className="label-caps text-gold">Apartment Collection</p>
          <h3 className="mt-4 font-serif text-[2.2rem] leading-[1.03] text-ink md:text-[3rem]">
            Choose your long-stay layout
            <br />
            based on your rhythm.
          </h3>
        </FadeInView>

        <StaggerContainer
          className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
          staggerDelay={0.18}
        >
          {apartmentTypes.map((unit) => (
            <StaggerItem
              key={unit.name}
              className="group overflow-hidden border border-gold/25 bg-cream"
            >
              <motion.article
                className="h-full"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="h-[300px] overflow-hidden md:h-[340px]">
                  <motion.img
                    src={unit.image}
                    alt={`${unit.name} apartment`}
                    className="h-full w-full object-cover transition-transform duration-[1900ms] ease-out group-hover:scale-[1.06]"
                  />
                </div>
                <div className="flex min-h-[260px] flex-col p-7 md:p-8">
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-[2.1rem] leading-none text-ink">
                      {unit.name}
                    </p>
                    <p className="label-caps text-gold-dark">{unit.area}</p>
                  </div>
                  <p className="mt-5 text-[1rem] leading-8 text-ink/80">
                    {unit.description}
                  </p>
                  <div className="mt-auto border-t border-gold/25 pt-6">
                    <Link
                      href={unit.href}
                      className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dark transition-all duration-500 hover:text-ink group-hover:tracking-[0.26em]"
                    >
                      View Apartment
                    </Link>
                  </div>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="border-b border-gold/30 bg-cream">
        <div className="w-full px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28">
          <StaggerContainer
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
            staggerDelay={0.09}
          >
            {easyMoments.map((image, index) => (
              <StaggerItem
                key={image}
                className="group overflow-hidden border border-gold/25 bg-white"
              >
                <button
                  onClick={() => setGalleryIndex(index)}
                  className="relative block h-full w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 appearance-none"
                  aria-label={`Open gallery image ${index + 1}`}
                >
                  <motion.img
                    src={image}
                    alt={`Easy living moment ${index + 1}`}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1700ms] ease-out group-hover:scale-[1.06]"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeInView className="mx-auto mt-14 w-full max-w-[1120px] text-center">
            <p className="mx-auto max-w-[920px] text-[1.05rem] leading-8 text-ink/80 md:text-[1.16rem] md:leading-9">
              Easy Living means fewer operational worries and more energy for
              what matters: work, wellness, and enjoying Bali with a stable
              monthly base.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 md:gap-5">
              <Link href="/contact" className={BTN_GOLD}>
                Book Easy Living
              </Link>
              <Link href="/healthy-living" className={BTN_DARK}>
                Explore Healthy Living
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      <AnimatePresence>
        {galleryIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-[140] flex items-center justify-center bg-black/88 px-4 py-10 md:px-8"
            onClick={() => setGalleryIndex(-1)}
          >
            <button
              onClick={() => setGalleryIndex(-1)}
              className="absolute top-4 right-4 z-10 h-11 w-11 cursor-pointer border border-white/30 bg-black/30 text-2xl leading-none text-white transition-colors hover:bg-white/15 md:top-6 md:right-6"
              aria-label="Close gallery"
            >
              ×
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setGalleryIndex(
                  (prev) =>
                    (prev - 1 + easyMoments.length) % easyMoments.length,
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
                setGalleryIndex((prev) => (prev + 1) % easyMoments.length);
              }}
              className="absolute right-2 z-10 h-11 w-11 cursor-pointer border border-white/25 bg-black/30 text-2xl leading-none text-white transition-colors hover:bg-white/15 md:right-6"
              aria-label="Next image"
            >
              ›
            </button>

            <motion.figure
              key={easyMoments[galleryIndex]}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[1320px]"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={easyMoments[galleryIndex]}
                alt={`Easy living moment ${galleryIndex + 1}`}
                className="max-h-[82vh] w-full object-contain"
              />
              <figcaption className="mt-4 text-center text-[12px] uppercase tracking-[0.18em] text-white/80">
                {galleryIndex + 1} / {easyMoments.length}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
