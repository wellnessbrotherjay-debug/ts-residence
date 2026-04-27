"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BTN_GOLD } from "../../constants";
import { FadeInView, StaggerContainer, StaggerItem } from "../animations";
import type { Page } from "../../types";
import { apartmentDetailMap, type ApartmentKey } from "@/lib/apartments-content";
import { beginImageLoadMeasure, endImageLoadMeasure } from "@/lib/performance";

// Map Page type to ApartmentKey for image gallery lookup
const pageToApartmentKey: Partial<Record<Page, ApartmentKey>> = {
  solo: "solo",
  studio: "studio",
  soho: "soho",
};

// Get apartment key from page - defaults to solo for unknown pages
const getApartmentKeyFromPage = (page: Page): ApartmentKey => {
  return pageToApartmentKey[page] || "solo";
};

interface Apartment {
  name: string;
  sqm: string;
  bed: string;
  desc: string;
  img: string;
  page: Page;
}

interface HomeApartmentsProps {
  setPage: (p: Page) => void;
  apartments: Apartment[];
}

const CARD_BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

const CARD_IMAGE_SIZES = "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw";

// Apartment Card Component with Isolated Image Gallery
function ApartmentCard({
  apt,
  index,
  setPage,
}: {
  apt: Apartment;
  index: number;
  setPage: (p: Page) => void;
}) {
  // Isolated state for each card instance
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shouldLoadImage, setShouldLoadImage] = useState(index < 2);

  // Use refs for values that don't need to trigger re-renders (React best practice)
  const cardRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isMobileRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeMeasureIdRef = useRef<string | null>(null);

  const aptKey = getApartmentKeyFromPage(apt.page);
  const images = apartmentDetailMap[aptKey].gallery;

  useEffect(() => {
    if (shouldLoadImage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoadImage(true);
        observer.disconnect();
      },
      { rootMargin: "240px 0px" },
    );

    const node = cardRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      observer.disconnect();
    };
  }, [shouldLoadImage]);

  // Detect mobile - isolated per card
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 1024;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Memoize start/stop cycling functions to prevent recreating on every render
  const startCycling = useCallback(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => {
        if (!images || images.length === 0) return 0;
        return (prev + 1) % images.length;
      });
    }, 1500);
  }, [images]);

  const stopCycling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Handle mouse enter - use ref to avoid unnecessary re-renders
  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    if (!shouldLoadImage) {
      setShouldLoadImage(true);
    }
    if (!isMobileRef.current) {
      startCycling();
    }
  }, [shouldLoadImage, startCycling]);

  // Handle mouse leave - use ref to avoid unnecessary re-renders
  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    stopCycling();
    // Reset to first image when not hovered on desktop
    if (!isMobileRef.current) {
      setCurrentImageIndex(0);
    }
  }, [stopCycling]);

  // Auto-cycle on mobile or when hovered - optimized with stable dependencies
  useEffect(() => {
    if (isMobileRef.current && shouldLoadImage) {
      // Always cycle on mobile
      startCycling();
    }

    return () => {
      stopCycling();
    };
  }, [shouldLoadImage, startCycling, stopCycling]);

  useEffect(() => {
    if (!shouldLoadImage || images.length === 0) return;

    const imageSrc = images[currentImageIndex];
    const measureId = `${apt.page}-${currentImageIndex}`;
    activeMeasureIdRef.current = measureId;
    beginImageLoadMeasure(measureId, imageSrc);
  }, [apt.page, currentImageIndex, images, shouldLoadImage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleBookNow = useCallback(() => {
    const message = `I'm interested in booking a ${apt.name} apartment at TS Residence`;
    window.open(
      `https://wa.me/6281119028111?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }, [apt.name]);

  const handleViewApartment = useCallback(() => {
    setPage(apt.page);
  }, [apt.page, setPage]);

  // Handle image click to navigate to apartment page
  const handleImageClick = useCallback(() => {
    setPage(apt.page);
  }, [apt.page, setPage]);

  return (
    <StaggerItem key={index}>
      <div
        ref={cardRef}
        className="group w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <FadeInView direction="up">
          {/* Compact Card Layout */}
          <div className="border-gold/20 border bg-white overflow-hidden">
            {/* Clickable Image Area - More Compact */}
            <button
              onClick={handleImageClick}
              className="relative aspect-4/3 overflow-hidden w-full cursor-pointer text-left"
              aria-label={`View ${apt.name} apartment details`}
            >
              {/* Image Album - Isolated per card */}
              <div className="relative h-full w-full">
                {shouldLoadImage && images.length > 0 ? (
                  <Image
                    src={images[currentImageIndex]}
                    alt={`${apt.name} - Image ${currentImageIndex + 1} of ${images.length}`}
                    fill
                    className="object-cover transition-opacity duration-500"
                    sizes={CARD_IMAGE_SIZES}
                    loading="lazy"
                    quality={60}
                    decoding="async"
                    placeholder="blur"
                    blurDataURL={CARD_BLUR_DATA_URL}
                    onLoad={() => {
                      const measureId = activeMeasureIdRef.current;
                      if (!measureId) return;
                      endImageLoadMeasure(measureId, {
                        component: "home_apartment_card",
                        apartment: apt.name,
                        image_index: currentImageIndex,
                        image_src: images[currentImageIndex],
                      });
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(180deg,rgba(250,247,242,0.92),rgba(226,219,205,0.7))]" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
              </div>

              {/* Title & Size Overlay - Centered */}
              <div className="absolute right-0 bottom-0 left-0 px-4 pb-3 pt-4 text-white">
                <div className="flex flex-col items-center justify-center text-center">
                  <h3 className="font-serif text-xl leading-tight">
                    {apt.name}
                  </h3>
                  <span className="text-[10px] tracking-[0.15em] text-white/80 uppercase mt-1.5 block">
                    {apt.sqm} sqm · {apt.bed}
                  </span>
                </div>
              </div>
            </button>

            {/* Content Area - Compact */}
            <div className="px-3 py-2">
              {/* Description - Truncated */}
              <p className="text-body text-ink-light text-xs leading-relaxed line-clamp-1">
                {apt.desc}
              </p>

              {/* CTA Buttons - Inline Row */}
              <div className="flex gap-1.5 mt-2">
                <button
                  onClick={handleBookNow}
                  className="inline-flex items-center justify-center gap-1 bg-[#C4A574] hover:bg-[#A68B5C] text-white px-3 py-1.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 flex-1"
                  aria-label={`Book ${apt.name} apartment`}
                >
                  Book
                </button>
                <button
                  onClick={handleViewApartment}
                  className="inline-flex items-center justify-center gap-1 border border-[#C4A574]/30 hover:border-[#C4A574] text-[#8B7355] hover:text-[#C4A574] px-3 py-1.5 rounded text-[10px] font-medium uppercase tracking-wider transition-all duration-200 flex-1"
                  aria-label={`View ${apt.name} apartment details`}
                >
                  View
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </FadeInView>
      </div>
    </StaggerItem>
  );
}

export const HomeApartments = ({
  setPage,
  apartments,
}: HomeApartmentsProps) => (
  <section
    data-reveal-profile="cinematic"
    className="bg-white px-4 py-6 md:px-8 md:py-10 lg:px-12 lg:py-14"
  >
    {/* Compact Header */}
    <div className="mb-5 flex flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
      <div className="max-w-2xl">
        <span className="label-caps text-gold text-[10px]">Suites &amp; Apartments</span>
        <h2 className="heading-section text-ink mt-2 text-2xl md:text-3xl">
          Find Your Perfect Space
        </h2>
      </div>

      <button
        onClick={() => setPage("apartments")}
        className={`${BTN_GOLD} border-gold-dark text-gold-dark hover:bg-gold-dark self-start text-xs px-4 py-2`}
      >
        View All <ArrowRight size={12} />
      </button>
    </div>

    {/* Compact Grid - More columns on larger screens */}
    <StaggerContainer
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
      staggerDelay={0.1}
    >
      {apartments.map((apt, i) => (
        <ApartmentCard key={i} apt={apt} index={i} setPage={setPage} />
      ))}
    </StaggerContainer>
  </section>
);
