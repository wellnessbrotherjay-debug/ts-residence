"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";


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

export const HeroSection = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewportH, setViewportH] = useState(600);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => setViewportH(Math.min(window.innerHeight * 0.55, 500));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Preload ALL hero images for instant display
  useEffect(() => {
    // Preload via link tags for priority
    HERO_SLIDES.forEach((slide) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = slide.image;
      link.fetchPriority = "high";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });

    return () => {
      const links = document.head.querySelectorAll('link[rel="preload"][as="image"]');
      links.forEach(link => link.remove());
    };
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);

    return () => clearInterval(interval);
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

    if (isLeftSwipe) setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    if (isRightSwipe) setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleBookClick = () => {
    const message = encodeURIComponent(HERO_SLIDES[currentSlide].whatsappMessage);
    window.open(`https://wa.me/6281119028111?text=${message}`, "_blank");
  };

  const handleExploreClick = () => {
    router.push(HERO_SLIDES[currentSlide].exploreLink);
  };

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
        animate={{ x: `-${currentSlide * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {HERO_SLIDES.map((slide, slideIndex) => (
          <div
            key={slide.image}
            className="min-w-full h-full relative bg-neutral-800"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={slideIndex === 0}
              quality={75}
              loading={slideIndex === 0 ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
          </div>
        ))}
      </motion.div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white transition-all hover:bg-white/20 hover:border-white/50 md:left-8 md:h-14 md:w-14"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white transition-all hover:bg-white/20 hover:border-white/50 md:right-8 md:h-14 md:w-14"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Animated Content */}
      <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-4">
        <div className="max-w-4xl text-center w-full px-2">
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
          >
            {HERO_SLIDES[currentSlide].title}
          </motion.h1>

          <motion.p
            key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-1 md:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-base font-medium text-white max-w-3xl mx-auto px-2 line-clamp-2"
          >
            {HERO_SLIDES[currentSlide].subtitle}
          </motion.p>
        </div>
      </div>

      {/* Static Buttons - Not Animated */}
      <div className="absolute bottom-4 sm:bottom-5 left-0 right-0 flex flex-col items-center px-3 sm:px-4 z-20 gap-1 sm:gap-1.5">
        {/* Hero Navigation - Marketing Campaign */}
        <div className="hero-top-nav flex flex-wrap sm:flex-row items-center justify-center gap-2 sm:gap-4 px-1 w-full">
          {[
            { text: "APARTMENTS", link: "/apartments" },
            { text: "FIVE-STAR LIVING", link: "/five-star-living" },
            { text: "HEALTHY LIVING", link: "/healthy-living" },
            { text: "EASY LIVING", link: "/easy-living" },
          ].map((item, index) => (
            <div key={item.text} className="flex items-center gap-2 sm:gap-4">
              <a
                href={item.link}
                className="text-white/80 hover:text-white text-[10px] sm:text-[11px] tracking-[0.1em] uppercase transition-colors duration-300 whitespace-nowrap overflow-visible font-bold"
                style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}
              >
                {item.text}
              </a>
              {index < 3 && (
                <span className="hidden sm:inline text-white/40 text-[10px]">|</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5">
          <button
            onClick={handleBookClick}
            className="inline-flex items-center gap-1 bg-white hover:bg-gray-100 text-gray-900 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg"
          >
            Book
          </button>
          <button
            onClick={handleExploreClick}
            className="inline-flex items-center gap-1 border-2 border-white/60 hover:border-white hover:bg-white/10 text-white px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
          >
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
};
