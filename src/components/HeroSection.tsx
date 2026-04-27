"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { beginImageLoadMeasure, endImageLoadMeasure } from "@/lib/performance";


const HERO_SLIDES = [
  {
    title: "TS RESIDENCE",
    subtitle: "A new living concept by TS Suites",
    description: "Monthly rentals in Seminyak, Bali with hotel-grade access and long-stay comfort",
    image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/e21d0685-e347-4234-84bf-5e5c84170a00/public",
    exploreLink: "/apartments",
    whatsappMessage: "I'm interested in an apartment at TS Residence",
  },
  {
    title: "Five-star living",
    subtitle: "Enjoy full access to TS Suites Hotel — rooftop infinity pool, 24/7 gym, leisure club, salon, and designer retail — all just steps from your door.",
    description: "Pool, gym, salon, restaurant — everything included in your stay",
    image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/3f554a00-be28-469b-2514-1a37ae5ff000/public",
    exploreLink: "/five-star-living",
    whatsappMessage: "I'm interested in the Five-star living experience at TS Residence",
  },
  {
    title: "Healthy living",
    subtitle: "From daily yoga and reformer Pilates to sauna, cold bath, and IV therapy — everything is designed to help you feel your best, every day.",
    description: "Yoga, Pilates, sauna, wellness programs for daily well-being",
    image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/12154d04-cda4-4f32-0e93-216f2d4d6a00/public",
    exploreLink: "/healthy-living",
    whatsappMessage: "I'm interested in the Healthy living program at TS Residence",
  },
  {
    title: "Easy living",
    subtitle: "Located in central Seminyak with direct access to Sunset Road, flexible monthly leases, 24/7 security, and everything you need within minutes.",
    description: "Central Seminyak location with flexible monthly leases",
    image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/8a973f26-d47d-48b1-a369-95c0c042ba00/public",
    exploreLink: "/easy-living",
    whatsappMessage: "I'm interested in the Easy living option at TS Residence",
  },
];

const LOOPED_HERO_SLIDES = [
  HERO_SLIDES[HERO_SLIDES.length - 1],
  ...HERO_SLIDES,
  HERO_SLIDES[0],
];

const HERO_AUTOPLAY_DELAY_MS = 4000;

const HERO_IMAGE_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

const normalizeSlideIndex = (trackIndex: number) => {
  if (trackIndex === 0) return HERO_SLIDES.length - 1;
  if (trackIndex === HERO_SLIDES.length + 1) return 0;
  return trackIndex - 1;
};

export const HeroSection = () => {
  const router = useRouter();
  const [trackIndex, setTrackIndex] = useState(1);
  const [viewportH, setViewportH] = useState(600);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTrackTransitionEnabled, setIsTrackTransitionEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<number | null>(null);
  const hasMeasuredInitialHeroRef = useRef(false);
  const currentSlide = normalizeSlideIndex(trackIndex);

  useEffect(() => {
    const measure = () => {
      const isMobile = window.innerWidth < 768;
      const visualHeight = window.visualViewport?.height ?? window.innerHeight;
      setViewportH(
        isMobile
          ? Math.max(240, visualHeight - 50)
          : Math.min(window.innerHeight * 0.72, 720),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (isPaused) return;

    const advanceSlide = () => {
      setIsTrackTransitionEnabled(true);
      setTrackIndex((prev) => prev + 1);
    };

    const initialTimeout = window.setTimeout(() => {
      advanceSlide();

      autoplayIntervalRef.current = window.setInterval(
        advanceSlide,
        HERO_AUTOPLAY_DELAY_MS,
      );
    }, HERO_AUTOPLAY_DELAY_MS);

    return () => {
      window.clearTimeout(initialTimeout);

      if (autoplayIntervalRef.current !== null) {
        window.clearInterval(autoplayIntervalRef.current);
        autoplayIntervalRef.current = null;
      }
    };
  }, [isPaused]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setIsTrackTransitionEnabled(true);
      setTrackIndex((prev) => prev + 1);
    }

    if (isRightSwipe) {
      setIsTrackTransitionEnabled(true);
      setTrackIndex((prev) => prev - 1);
    }
  };

  const handleTrackAnimationComplete = () => {
    if (trackIndex === HERO_SLIDES.length + 1) {
      setIsTrackTransitionEnabled(false);
      setTrackIndex(1);
      return;
    }

    if (trackIndex === 0) {
      setIsTrackTransitionEnabled(false);
      setTrackIndex(HERO_SLIDES.length);
    }
  };

  useEffect(() => {
    if (isTrackTransitionEnabled) return;

    const resetTransition = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsTrackTransitionEnabled(true);
      });
    });

    return () => window.cancelAnimationFrame(resetTransition);
  }, [isTrackTransitionEnabled]);

  const handleBookClick = () => {
    const message = encodeURIComponent(HERO_SLIDES[currentSlide].whatsappMessage);
    window.open(`https://wa.me/6281119028111?text=${message}`, "_blank");
  };

  const handleExploreClick = () => {
    router.push(HERO_SLIDES[currentSlide].exploreLink);
  };

  useEffect(() => {
    beginImageLoadMeasure("hero-initial", HERO_SLIDES[0].image);
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero-carousel"
      className="relative w-full overflow-x-hidden bg-neutral-900"
      style={{ height: `${Math.round(viewportH)}px` }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Images - Horizontal Slide */}
      <motion.div
        className="absolute inset-0 flex"
        animate={{ x: `-${trackIndex * 100}%` }}
        transition={
          isTrackTransitionEnabled
            ? { type: "spring", stiffness: 300, damping: 30 }
            : { duration: 0 }
        }
        onAnimationComplete={handleTrackAnimationComplete}
      >
        {LOOPED_HERO_SLIDES.map((slide, slideIndex) => (
          <div
            key={`${slide.image}-${slideIndex}`}
            className="min-w-full h-full relative bg-neutral-800"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              className="object-contain md:object-cover"
              priority={slideIndex === 1}
              fetchPriority={slideIndex === 1 ? "high" : undefined}
              quality={60}
              loading={slideIndex === 1 ? "eager" : "lazy"}
              decoding="async"
              placeholder="blur"
              blurDataURL={HERO_IMAGE_BLUR}
              onLoad={() => {
                if (slideIndex !== 1 || hasMeasuredInitialHeroRef.current) return;
                hasMeasuredInitialHeroRef.current = true;
                endImageLoadMeasure("hero-initial", {
                  component: "hero",
                  image_role: "hero",
                  image_src: slide.image,
                });
              }}
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/8 to-black/62" />
            <div className="absolute inset-0 bg-linear-to-r from-black/22 via-transparent to-black/20" />
          </div>
        ))}
      </motion.div>

      {/* Animated Content */}
      <div className="absolute inset-x-0 top-[42%] z-10 flex -translate-y-1/2 items-center justify-center px-4 sm:top-[40%] sm:px-6 md:top-[45%]">
        <div className="max-w-4xl text-center w-full px-2">
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-serif text-[clamp(2.2rem,12vw,2.85rem)] font-bold leading-[0.92] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.48)] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.8rem]"
          >
            {HERO_SLIDES[currentSlide].title}
          </motion.h1>

          <motion.p
            key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mx-auto mt-3 max-w-3xl px-2 text-[0.88rem] font-medium leading-tight text-white/95 line-clamp-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:text-[1.05rem] md:mt-4 md:text-lg lg:text-xl"
          >
            {HERO_SLIDES[currentSlide].subtitle}
          </motion.p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 h-[48%] bg-linear-to-t from-black/86 via-black/42 to-transparent sm:h-[42%]" />

      {/* Static Buttons - Not Animated */}
      <div className="absolute right-0 bottom-4 left-0 z-20 flex flex-col items-center gap-3 px-3 sm:bottom-8 sm:gap-5 sm:px-4">
        {/* Hero Navigation - Marketing Campaign */}
        <div className="hero-top-nav w-full px-0.5">
          <div className="mx-auto flex w-full max-w-md flex-nowrap items-center justify-center gap-4 overflow-hidden sm:gap-7">
            {[
              { text: "APARTMENTS", link: "/apartments" },
              { text: "FIVE-STAR LIVING", link: "/five-star-living" },
              { text: "HEALTHY LIVING", link: "/healthy-living" },
              { text: "EASY LIVING", link: "/easy-living" },
            ].map((item) => (
              <button
                key={item.text}
                type="button"
                onClick={() => router.push(item.link)}
                className="flex shrink-0 items-center justify-center px-0 py-1 text-center"
              >
                <span
                  className="block whitespace-nowrap text-center text-[0.47rem] leading-none font-semibold tracking-widest text-white uppercase transition-colors duration-300 hover:text-white sm:text-[0.68rem] sm:tracking-[0.14em]"
                  style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}
                >
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-center gap-2.5 sm:gap-3">
          <button
            onClick={handleBookClick}
            className="inline-flex h-7 min-w-22.5 items-center justify-center rounded-full bg-white px-5 text-[0.58rem] font-bold tracking-[0.12em] text-gray-900 uppercase shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition-all duration-300 hover:bg-gray-100 sm:h-9 sm:min-w-29.5 sm:text-[0.7rem]"
          >
            Book
          </button>
          <button
            onClick={handleExploreClick}
            className="inline-flex h-7 min-w-26 items-center justify-center whitespace-nowrap rounded-full border border-white/70 px-5 text-[0.58rem] font-bold tracking-[0.12em] text-white uppercase shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-all duration-300 hover:border-white hover:bg-white/10 sm:h-9 sm:min-w-34.5 sm:text-[0.7rem]"
          >
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
};
