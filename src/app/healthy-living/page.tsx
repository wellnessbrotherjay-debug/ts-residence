"use client";

import Link from "next/link";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
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
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-wellness-studio.webp",
  },
  {
    title: "Reformer Pilates",
    description:
      "Specialized reformer programs for posture, flexibility, and full-body conditioning.",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-reformer-pilater.webp",
  },
  {
    title: "Night Sauna",
    description:
      "Evening heat therapy sessions to release tension and support deep-quality rest.",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-night-sauna.webp",
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
  const gallerySlides = communityMoments.map((item) => ({
    src: item.src,
    alt: item.alt,
  }));

  return (
    <div className="overflow-x-hidden bg-cream">
      <section className="relative min-h-[78vh] border-y border-gold/30 md:min-h-[92vh]">
        <img
          src="https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-wellness-club-building-gate.webp"
          alt="Healthy Living at TS Residence"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/52 to-black/32" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/52 via-transparent to-black/28" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_22%,rgba(196,160,96,0.23),transparent_46%)]" />
        <div className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-black/36 to-transparent" />

        <div className="relative flex min-h-[78vh] w-full items-end px-6 pb-10 pt-28 md:min-h-[92vh] md:px-12 md:pb-14 md:pt-34 lg:px-20 lg:pb-18 xl:px-28">
          <FadeInView className="w-full max-w-[1120px] text-white">
            <div className="inline-flex items-center gap-3 border border-gold/50 bg-black/30 px-4 py-2 backdrop-blur-md">
              <span className="label-caps text-gold-light">Healthy Living</span>
              <span className="h-1 w-1 rounded-full bg-gold-light/85" />
              <span className="text-[10px] uppercase tracking-[0.24em] text-white/80">
                No.1 Wellness Club
              </span>
            </div>

            <div className="mt-7 h-px w-28 bg-gradient-to-r from-gold/90 to-gold/20" />

            <h1 className="mt-7 max-w-[18ch] font-serif text-[2.55rem] leading-[0.95] tracking-[-0.03em] sm:text-6xl md:text-[4.4rem] lg:text-[5.5rem]">
              Elevated
              <br />
              wellness living
              <br />
              in Seminyak.
            </h1>

            <div className="mt-9 max-w-[760px] border border-gold/28 bg-black/28 p-6 backdrop-blur-md md:p-8">
              <p className="text-[1.02rem] leading-8 text-white/92 md:text-[1.12rem] md:leading-9">
                Build your daily rhythm around movement, recovery, and premium
                support facilities designed for healthier monthly residence.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 border-t border-gold/25 pt-5 text-[11px] uppercase tracking-[0.2em] text-white/78 sm:grid-cols-3">
                <span>Recovery</span>
                <span>Performance</span>
                <span>Community</span>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      <section className="border-b border-gold/30 bg-white">
        <div className="section-shell px-6 py-16 md:px-12 md:py-18 lg:px-20 lg:py-22 xl:px-28">
          <StaggerContainer
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5"
            staggerDelay={0.16}
          >
            {wellnessPillars.map((item, idx) => (
              <StaggerItem
                key={item.title}
                className="group border border-gold/25 bg-cream px-6 py-7 transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(28,25,23,0.08)] md:px-7 md:py-8"
              >
                <div className="flex items-center justify-between">
                  <p className="label-caps text-gold-dark">{item.title}</p>
                  <span className="font-serif text-[1.35rem] text-gold/60">
                    {String(idx + 1).padStart(2, "0")}
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
          <FadeInView className="mx-auto max-w-[900px] text-center">
            <p className="label-caps text-gold">No.1 Wellness Club</p>
            <h2 className="mt-5 font-serif text-[2.35rem] leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl md:text-[3.2rem] lg:text-6xl">
              A complete wellness ecosystem,
              <br />
              integrated with residence life.
            </h2>
            <p className="mx-auto mt-7 max-w-[760px] text-[1.03rem] leading-8 text-ink/80 md:text-[1.1rem]">
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
              className="group h-full overflow-hidden border border-gold/25 bg-white"
            >
              <article className="h-full">
                <div className="h-[280px] overflow-hidden md:h-[320px] lg:h-[350px]">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="h-full w-full object-cover transition-transform duration-[1700ms] ease-out group-hover:scale-[1.045]"
                  />
                </div>
                <div className="flex min-h-[280px] flex-col p-6 md:min-h-[300px] md:p-7">
                  <p className="label-caps text-gold-dark">Wellness Facility</p>
                  <h3 className="mt-3 font-serif text-[2rem] leading-[1.04] text-ink">
                    {facility.title}
                  </h3>
                  <p className="mt-4 text-[1rem] leading-7 text-ink/80">
                    {facility.description}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="border-y border-gold/30 bg-white">
        <div className="grid w-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          <FadeInView
            direction="left"
            className="relative min-h-[360px] overflow-hidden md:min-h-[420px] lg:min-h-[540px]"
          >
            <img
              src="https://tsresidence.id/wp-content/uploads/2025/10/massage-room.webp"
              alt="Massage recovery room"
              className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          </FadeInView>
          <div className="flex items-center px-6 py-14 md:px-12 lg:px-14 lg:py-18">
            <FadeInView direction="right" className="max-w-[36rem]">
              <p className="label-caps text-gold">Recovery Rooms</p>
              <h3 className="mt-5 font-serif text-[2.2rem] leading-[1.04] tracking-[-0.03em] text-ink md:text-[2.9rem]">
                Dedicated spaces for
                <br />
                deeper physical recovery.
              </h3>
              <p className="mt-6 text-[1.02rem] leading-8 text-ink/80">
                Transition between massage therapy, preparation lounge, and
                wellness treatment spaces in one seamless resident experience.
              </p>
              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="overflow-hidden border border-gold/25 bg-cream">
                  <img
                    src="https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-dressing-room.webp"
                    alt="Dressing room"
                    className="h-[180px] w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden border border-gold/25 bg-cream">
                  <img
                    src="https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-iv-room.webp"
                    alt="IV room"
                    className="h-[180px] w-full object-cover"
                  />
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      <section className="border-b border-gold/30 bg-cream">
        <div className="w-full px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28">
          <FadeInView className="mx-auto max-w-[900px] text-center">
            <p className="label-caps text-gold">Community Moments</p>
            <h4 className="mt-4 font-serif text-[2.25rem] leading-[1.03] text-ink md:text-[2.9rem]">
              Healthy living is also social, inspiring,
              <br />
              and deeply connected.
            </h4>
          </FadeInView>

          <StaggerContainer
            className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5"
            staggerDelay={0.07}
          >
            {communityMoments.map((image, i) => (
              <StaggerItem
                key={image.src}
                className="group overflow-hidden border border-gold/25 bg-white"
              >
                <button
                  onClick={() => setGalleryIndex(i)}
                  className="relative block h-full w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 appearance-none"
                  aria-label={`Open gallery image ${i + 1}`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`w-full aspect-video object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.06]`}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="text-[10px] uppercase tracking-[0.2em]">
                      View Image
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeInView className="mx-auto mt-14 w-full max-w-[1120px] text-center">
            <p className="mx-auto max-w-[920px] text-[1.05rem] leading-8 text-ink/80 md:text-[1.16rem] md:leading-9">
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

      <Lightbox
        open={galleryIndex >= 0}
        close={() => setGalleryIndex(-1)}
        index={galleryIndex < 0 ? 0 : galleryIndex}
        slides={gallerySlides}
      />
    </div>
  );
}
