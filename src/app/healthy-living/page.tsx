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

const wellnessPillars = [
  {
    title: "Recovery",
    description:
      "Sauna, jacuzzi, and guided cooldown sequences designed to restore your body after long workdays.",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/08/people-relaxing-on-jacuzzi-in-tsresidence.webp",
  },
  {
    title: "Performance",
    description:
      "Pilates, movement sessions, and expert-led classes to strengthen mobility and daily stamina.",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-reformer-pilater.webp",
  },
  {
    title: "Nutrition",
    description:
      "Juice and wellness nutrition options to support healthier routines and sustained energy levels.",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-juice-nutrition-cafe.webp",
  },
];

const wellnessFacilities = [
  {
    title: "Wellness Studio",
    description:
      "A calm, beautifully curated environment for yoga, mindfulness, and guided movement sessions.",
    image:
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/12a96763-9bfb-47d8-8199-4702767d5d00/public",
  },
  {
    title: "Reformer Pilates",
    description:
      "Specialized reformer programs for posture, flexibility, and full-body conditioning.",
    image:
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/d3acb1e6-97d9-49f0-da61-b4ad90f74300/public",
  },
  {
    title: "Night Sauna",
    description:
      "Evening heat therapy sessions to release tension and support deep-quality rest.",
    image:
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/c4706bf4-10a7-4895-5be3-6c35b0eb3100/public",
  },
  {
    title: "IV Therapy Room",
    description:
      "Targeted IV support to optimize hydration, recovery, and overall physical resilience.",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-iv-room.webp",
  },
];

const communityMoments = [
  {
    src: "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tsc-community-scaled.webp",
    alt: "TS Residence wellness community gathering",
  },
  {
    src: "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tsc-pilates-class-scaled.webp",
    alt: "Pilates class at TS Residence",
  },
  {
    src: "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tsc-yoga-class.webp",
    alt: "Yoga class by the pool",
  },
  {
    src: "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tsc-pool-exercise-scaled.webp",
    alt: "Pool exercise session",
  },
  {
    src: "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tsc-pool-party.webp",
    alt: "Pool social event",
  },
  {
    src: "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-business-networking-scaled-e1759735087307.webp",
    alt: "Business networking event",
  },
  {
    src: "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tssuites-special-events-scaled.webp",
    alt: "Special event at TS Suites",
  },
  {
    src: "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tstore-fashion-show-scaled.webp",
    alt: "Fashion show community event",
  },
  {
    src: "https://tsresidence.id/wp-content/uploads/2025/08/social-and-wellness-event-ts-residence.webp",
    alt: "Social and wellness activity",
  },
  {
    src: "https://tsresidence.id/wp-content/uploads/2025/08/an-instructure-leading-the-exercise-in-ts-residence.webp",
    alt: "Instructor leading exercise session",
  },
  {
    src: "https://tsresidence.id/wp-content/uploads/2025/08/a-half-body-shot-of-a-woman-doing-meditaition-in-ts-residence.webp",
    alt: "Meditation practice session",
  },
  {
    src: "https://tsresidence.id/wp-content/uploads/2025/09/46cef01afe76ce46f8019d0f518ea165.jpg",
    alt: "Community wellness moment",
  },
];

export default function Page() {
  const [galleryIndex, setGalleryIndex] = useState<number>(-1);
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useSpring(useTransform(heroProgress, [0, 1], [0, 115]), {
    stiffness: 84,
    damping: 23,
    mass: 0.42,
  });
  const heroImageScale = useSpring(
    useTransform(heroProgress, [0, 1], [1, 1.08]),
    {
      stiffness: 92,
      damping: 24,
      mass: 0.45,
    },
  );
  const heroContentY = useSpring(useTransform(heroProgress, [0, 1], [0, -38]), {
    stiffness: 96,
    damping: 26,
    mass: 0.42,
  });
  const heroContentOpacity = useTransform(heroProgress, [0, 0.86], [1, 0.76]);
  useEffect(() => {
    if (galleryIndex < 0) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGalleryIndex(-1);
      if (event.key === "ArrowRight") {
        setGalleryIndex((prev) => (prev + 1) % communityMoments.length);
      }
      if (event.key === "ArrowLeft") {
        setGalleryIndex(
          (prev) =>
            (prev - 1 + communityMoments.length) % communityMoments.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [galleryIndex]);

  return (
    <div className="bg-cream overflow-x-hidden">
      <section
        ref={heroRef}
        className="border-gold/30 relative min-h-[48vh] overflow-hidden border-y md:min-h-[78vh] lg:min-h-[92vh]"
      >
        <motion.img
          src="https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-wellness-club-building-gate.webp"
          alt="Healthy Living at TS Residence"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ y: heroImageY, scale: heroImageScale }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/52 via-black/34 to-black/64" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(196,160,96,0.18),transparent_52%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-black/62 to-transparent" />

        <motion.div
          className="relative flex min-h-[48vh] w-full items-center justify-center px-5 py-14 text-center md:min-h-[78vh] md:px-12 md:py-22 lg:min-h-[92vh] lg:px-20 lg:py-24 xl:px-28"
          style={{ y: heroContentY, opacity: heroContentOpacity }}
        >
          <div
            data-reveal-group="0.1"
            className="w-full max-w-300 translate-y-4 text-white md:translate-y-10 lg:translate-y-12"
          >
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
              className="via-gold/80 mx-auto h-px w-28 origin-center bg-linear-to-r from-transparent to-transparent"
            />

            <h1 className="mx-auto mt-6 max-w-[12ch] font-serif text-[2.75rem] leading-[0.9] tracking-[-0.03em] sm:text-7xl md:mt-7 md:max-w-[14.5ch] md:text-[5.7rem] lg:text-[6.8rem]">
              Elevated
              <br />
              wellness living
              <br />
              in Seminyak.
            </h1>

            <p className="mx-auto mt-6 max-w-125 text-[0.97rem] leading-7 text-white/92 [text-shadow:0_2px_18px_rgba(0,0,0,0.38)] md:mt-9 md:max-w-190 md:text-[1.16rem] md:leading-9">
              Build your daily rhythm around movement, recovery, and premium
              support facilities designed for healthier monthly residence.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="border-gold/30 bg-cream border-b">
        <div className="w-full px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28">
          <FadeInView className="mx-auto max-w-225 text-center">
            <a href="https://www.no1wellness.com/" target="_blank" rel="noopener noreferrer" className="label-caps text-gold hover:text-gold-dark transition-colors inline-block">N°1 Wellness Studio</a>
            <h2 className="text-ink mt-5 font-serif text-[2.35rem] leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-[3.2rem] lg:text-6xl">
              A complete wellness ecosystem,
              <br />
              integrated with residence life.
            </h2>
            <p className="text-ink/80 mx-auto mt-7 max-w-190 text-[1.03rem] leading-8 md:text-[1.1rem]">
              Designed for consistent health routines, from guided movement and
              body recovery to nutrition and social wellness moments.
            </p>
          </FadeInView>
        </div>
      </section>

      <section className="w-full px-6 py-12 md:px-10 md:py-14 lg:px-12 lg:py-16 xl:px-14">
        <StaggerContainer
          className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4"
          staggerDelay={0.14}
        >
          {wellnessFacilities.map((facility) => (
            <StaggerItem
              key={facility.title}
              className="group border-gold/25 h-full overflow-hidden border bg-white"
            >
              <motion.article
                className="h-full"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="h-52 overflow-hidden md:h-65 lg:h-80">
                  <motion.img
                    src={facility.image}
                    alt={facility.title}
                    className="h-full w-full object-cover transition-transform duration-1900 ease-out group-hover:scale-[1.06]"
                  />
                </div>
                <div className="flex min-h-48 flex-col p-6 md:min-h-56 md:p-7 lg:min-h-70">
                  <p className="label-caps text-gold-dark">Wellness Facility</p>
                  <h3 className="text-ink mt-3 font-serif text-[2rem] leading-[1.04]">
                    {facility.title}
                  </h3>
                  <p className="text-ink/80 mt-4 text-[1rem] leading-7">
                    {facility.description}
                  </p>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="border-gold/30 border-b bg-white">
        <div className="section-shell px-6 py-16 md:px-12 md:py-18 lg:px-20 lg:py-22 xl:px-28">
          <StaggerContainer
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5"
            staggerDelay={0.16}
          >
            {wellnessPillars.map((item, idx) => (
              <StaggerItem
                key={item.title}
                className="group border-gold/25 bg-cream border px-6 py-7 transition-all duration-900 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(28,25,23,0.1)] md:px-7 md:py-8"
              >
                <div className="flex items-center justify-between">
                  <p className="label-caps text-gold-dark">{item.title}</p>
                  <span className="text-gold/60 group-hover:text-gold-dark font-serif text-[1.35rem] transition-all duration-700 group-hover:translate-x-1">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="from-gold/30 via-gold/15 mt-4 h-px w-full bg-linear-to-r to-transparent" />
                <p className="text-ink/80 mt-5 text-[1rem] leading-8">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-gold/30 border-y bg-white">
        <div className="grid w-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          <FadeInView
            direction="left"
            className="relative min-h-64 overflow-hidden md:min-h-90 lg:min-h-135"
          >
            <motion.img
              src="https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/13c17e41-4ce4-4d5f-b7a8-22b22d8cc600/public"
              alt="Spa recovery room"
              className="h-full w-full object-cover transition-transform duration-1800 ease-out hover:scale-[1.04]"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
          </FadeInView>
          <div className="flex items-center px-6 py-14 md:px-12 lg:px-14 lg:py-18">
            <FadeInView direction="right" className="max-w-xl">
              <p className="label-caps text-gold">Recovery Rooms</p>
              <h3 className="text-ink mt-5 font-serif text-[2.2rem] leading-[1.04] tracking-[-0.03em] md:text-[2.9rem]">
                Dedicated spaces for
                <br />
                deeper physical recovery.
              </h3>
              <p className="text-ink/80 mt-6 text-[1.02rem] leading-8">
                Transition between massage therapy, preparation lounge, and
                wellness treatment spaces in one seamless resident experience.
              </p>
              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="border-gold/25 bg-cream overflow-hidden border">
                  <motion.img
                    src="https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/7b91f79d-d4da-4872-4dea-b407d4e9d500/public"
                    alt="Recovery room lounge"
                    className="h-45 w-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <div className="border-gold/25 bg-cream overflow-hidden border">
                  <motion.img
                    src="https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/13c17e41-4ce4-4d5f-b7a8-22b22d8cc600/public"
                    alt="Recovery treatment area"
                    className="h-45 w-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      <section className="border-gold/30 bg-cream border-b">
        <div className="w-full px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28">
          <FadeInView className="mx-auto max-w-225 text-center">
            <p className="label-caps text-gold">Community Moments</p>
            <h4 className="text-ink mt-4 font-serif text-[2.25rem] leading-[1.03] md:text-[2.9rem]">
              Healthy living is also social, inspiring,
              <br />
              and deeply connected.
            </h4>
          </FadeInView>

          <StaggerContainer
            className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-3 lg:mt-20 lg:grid-cols-4 lg:gap-5"
            staggerDelay={0.07}
          >
            {communityMoments.map((image, i) => (
              <StaggerItem
                key={image.src}
                className="group border-gold/25 overflow-hidden border bg-white"
              >
                <button
                  onClick={() => setGalleryIndex(i)}
                  className="relative block h-full w-full cursor-pointer appearance-none overflow-hidden border-0 bg-transparent p-0"
                  aria-label={`Open gallery image ${i + 1}`}
                >
                  <motion.img
                    src={image.src}
                    alt={image.alt}
                    className="aspect-video w-full object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.07]"
                    whileHover={{ scale: 1.07 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex items-center justify-between text-white/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="text-[10px] tracking-[0.2em] uppercase">
                      View Image
                    </span>
                    <span className="text-[10px] tracking-[0.2em] uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeInView className="mx-auto mt-14 w-full max-w-280 text-center">
            <p className="text-ink/80 mx-auto max-w-230 text-[1.05rem] leading-8 md:text-[1.16rem] md:leading-9">
              From yoga and pilates classes to pool activities, networking, and
              curated social events, the wellness journey extends into
              community.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 md:gap-5">
              <Link href="/contact" className={BTN_GOLD}>
                Join Healthy Living
              </Link>
              <Link href="/five-star-living" className={BTN_DARK}>
                Explore Five-Star Living
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
            className="fixed inset-0 z-140 flex items-center justify-center bg-black/88 px-4 py-10 md:px-8"
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
                    (prev - 1 + communityMoments.length) %
                    communityMoments.length,
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
                setGalleryIndex((prev) => (prev + 1) % communityMoments.length);
              }}
              className="absolute right-2 z-10 h-11 w-11 cursor-pointer border border-white/25 bg-black/30 text-2xl leading-none text-white transition-colors hover:bg-white/15 md:right-6"
              aria-label="Next image"
            >
              ›
            </button>

            <figure
              key={communityMoments[galleryIndex].src}
              className="relative w-full max-w-330"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={communityMoments[galleryIndex].src}
                alt={communityMoments[galleryIndex].alt}
                className="max-h-[82vh] w-full object-contain"
              />
              <figcaption className="mt-4 text-center text-[12px] tracking-[0.18em] text-white/80 uppercase">
                {galleryIndex + 1} / {communityMoments.length}
              </figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
