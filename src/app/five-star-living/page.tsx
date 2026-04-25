"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";
import { BTN_DARK, BTN_GOLD } from "@/components/site/buttons";

const serviceHighlights = [
  {
    title: "Daily Operations",
    description:
      "Hotel-grade service support managed consistently from early morning to late evening.",
    detail: "06.00 AM - 10.00 PM",
  },
  {
    title: "Integrated Access",
    description:
      "Coworking, dining, salon, and social facilities connected in one residence ecosystem.",
    detail: "One Address",
  },
  {
    title: "Resident Priority",
    description:
      "A long-stay lifestyle built around privacy, ease, and premium everyday convenience.",
    detail: "Service-First",
  },
];

const facilityDescriptions: Record<string, string> = {
  "TS Suites Coworking Space":
    "A polished workspace for focus sessions, private calls, and productive daily routines.",
  TSTORE:
    "A curated retail stop for daily essentials and lifestyle needs within immediate reach.",
  "Christophe C Salon":
    "Professional grooming and beauty care tailored to a refined residential lifestyle.",
  "TS Suites Bar":
    "An elegant social venue for evening drinks, informal meetings, and relaxed conversations.",
};

const facilityCards = [
  {
    title: "TS Suites Coworking Space",
    image:
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/8a2ce61d-0aed-4265-e5f8-6e6381d64a00/public",
  },
  {
    title: "TSTORE",
    image:
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/32d0884b-8c29-4181-85b4-59306e635500/public",
  },
  {
    title: "Christophe C Salon",
    image:
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/c19d50e1-3c82-4c24-9488-c1a36bfe6a00/public",
  },
  {
    title: "TS Suites Bar",
    image:
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/e4d9a5db-20cd-4439-b3c5-0893221e4e00/public",
  },
];

// Hero images that transition on scroll
const scrollHeroImages = [
  {
    image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/95522767-3643-482c-5a4d-5068cf935600/public",
    alt: "TS Residence Five-Star Living - Main View",
    title: "Make five-star living your everyday experience",
    trigger: 0,
  },
  {
    image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/9824d539-1cf2-440a-d01f-fb51737b0300/public",
    alt: "TS Suites Coworking Space",
    title: "Curated workspaces for productivity",
    trigger: 0.25,
  },
  {
    image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/c7d7a14d-6caa-4eaa-dd61-26a5f852f900/public",
    alt: "TS Suites Rooftop Pool",
    title: "Rooftop infinity pool views",
    trigger: 0.5,
  },
  {
    image: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/306e3181-83b1-4aaa-05c4-2df1bf374200/public",
    alt: "TS Residence Luxury Living",
    title: "Elevated monthly living standards",
    trigger: 0.75,
  },
];

function ScrollHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollPercent = scrollY / (docHeight - windowHeight);

      // Find which image should be shown based on scroll percent
      let newIndex = 0;
      for (let i = scrollHeroImages.length - 1; i >= 0; i--) {
        if (scrollPercent >= scrollHeroImages[i].trigger) {
          newIndex = i;
          break;
        }
      }

      if (newIndex !== currentIndex && !isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex(newIndex);
          setTimeout(() => setIsTransitioning(false), 100);
        }, 300);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentIndex, isTransitioning]);

  const currentImage = scrollHeroImages[currentIndex];

  return (
    <div
      ref={containerRef}
      className="relative h-[90vh] md:h-[92vh] lg:h-[94vh] overflow-hidden"
    >
      {/* Background Images with Crossfade */}
      {scrollHeroImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img.image}
            alt={img.alt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <p className="text-gold text-sm font-semibold tracking-[0.3em] uppercase mb-4 animate-fade-in">
            Welcome to Five-Star Living
          </p>
          <h1 className="text-white font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 animate-fade-in-up">
            {currentImage.title}
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up">
            At TS Residence, you don't just live — you live with the full
            privileges of a five-star hotel, all under one roof.
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/60 text-xs uppercase tracking-widest">
          Scroll to explore
        </span>
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {scrollHeroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-gold w-6"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div
      data-reveal-profile="cinematic"
      className="relative isolate overflow-x-hidden"
    >
      <ScrollHero />

      <section
        data-reveal-profile="cinematic"
        className="border-gold/30 relative z-10 border-b bg-white"
      >
        <div className="section-shell px-6 py-16 md:px-12 md:py-18 lg:px-20 lg:py-22 xl:px-28">
          <FadeInView className="mx-auto mb-10 max-w-215 text-center lg:mb-12">
            <p className="label-caps text-gold">Operating Signature</p>
            <h2 className="text-ink mt-4 font-serif text-[2.1rem] leading-[1.02] md:text-[2.9rem] lg:text-5xl">
              Structured service rhythm,
              <br />
              designed to feel effortless.
            </h2>
          </FadeInView>
          <StaggerContainer
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5"
            staggerDelay={0.17}
          >
            {serviceHighlights.map((item, idx) => (
              <StaggerItem
                key={item.title}
                className="group border-gold/25 bg-cream border px-6 py-7 transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(28,25,23,0.08)] md:px-7 md:py-8"
              >
                <div className="flex items-center justify-between">
                  <p className="label-caps text-gold-dark">{item.title}</p>
                  <span className="text-gold/60 font-serif text-[1.35rem]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="from-gold/30 via-gold/15 mt-4 h-px w-full bg-linear-to-r to-transparent" />
                <p className="text-ink/80 mt-5 text-[1rem] leading-8">
                  {item.description}
                </p>
                <p className="text-gold-dark mt-4 text-[11px] font-semibold tracking-[0.22em] uppercase">
                  {item.detail}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section
        data-reveal-profile="cinematic"
        className="border-gold/30 bg-cream relative z-10 border-b"
      >
        <div className="section-shell px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28">
          <FadeInView className="mx-auto max-w-225 text-center">
            <p className="label-caps text-gold">Signature Facilities</p>
            <h2 className="text-ink mt-5 font-serif text-[2.35rem] leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-[3.2rem] lg:text-6xl">
              Privileges designed for
              <br />
              elevated monthly living.
            </h2>
            <p className="text-ink/80 mx-auto mt-7 max-w-190 text-[1.03rem] leading-8 md:text-[1.1rem]">
              Each facility supports a seamless rhythm from focused work
              sessions to grooming and social downtime.
            </p>
          </FadeInView>
        </div>
      </section>

      <section
        data-reveal-profile="cinematic"
        className="bg-cream relative z-10 w-full px-6 py-12 md:px-10 md:py-14 lg:px-12 lg:py-16 xl:px-14"
      >
        <StaggerContainer
          className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4"
          staggerDelay={0.14}
        >
          {facilityCards.map((facility) => (
            <StaggerItem
              key={facility.title}
              className="group border-gold/25 h-full overflow-hidden border bg-white"
            >
              <article className="h-full">
                <div className="h-52 overflow-hidden md:h-65 lg:h-80">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="h-full w-full object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.045]"
                  />
                </div>
                <div className="flex min-h-48 flex-col p-6 md:min-h-56 md:p-7 lg:min-h-70">
                  <p className="label-caps text-gold-dark">Facility Access</p>
                  <h3 className="text-ink mt-3 font-serif text-[2rem] leading-[1.04]">
                    {facility.title}
                  </h3>
                  <p className="text-ink/80 mt-4 text-[1rem] leading-7">
                    {facilityDescriptions[facility.title]}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section
        data-reveal-profile="cinematic"
        className="border-gold/30 relative z-10 border-y bg-white"
      >
        <div className="section-shell grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
          <FadeInView
            direction="left"
            className="group relative min-h-64 overflow-hidden md:min-h-90 lg:min-h-130"
          >
            <img
              src="https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/c7d7a14d-6caa-4eaa-dd61-26a5f852f900/public"
              alt="Five-star facilities - Rooftop Pool"
              className="h-full w-full object-cover transition-transform duration-1500 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
          </FadeInView>
          <div className="flex items-center px-6 py-14 md:px-12 lg:px-14 lg:py-18">
            <FadeInView direction="right" className="max-w-136">
              <p className="label-caps text-gold">Resident Benefit</p>
              <h3 className="text-ink mt-5 font-serif text-[2.2rem] leading-[1.04] tracking-[-0.03em] md:text-[2.9rem]">
                One residence,
                <br />
                multiple premium experiences.
              </h3>
              <p className="text-ink/80 mt-6 text-[1.02rem] leading-8">
                Enjoy integrated access to dining, social spaces, personal care,
                and business-ready facilities without leaving your residential
                environment.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/contact" className={BTN_GOLD}>
                  Book Apartment
                </Link>
                <Link href="/offers" className={BTN_DARK}>
                  View Offers
                </Link>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      <section
        data-reveal-profile="cinematic"
        className="border-gold/30 bg-cream relative z-10 border-b"
      >
        <div className="section-shell px-6 py-14 text-center md:px-12 md:py-16 lg:px-20 lg:py-20 xl:px-28">
          <FadeInView className="mx-auto max-w-200">
            <p className="label-caps text-gold">Private Tour</p>
            <h4 className="text-ink mt-4 font-serif text-[2.2rem] leading-[1.03] md:text-[2.9rem]">
              Schedule a private viewing and experience the full five-star
              standard.
            </h4>
            <p className="text-ink/80 mt-6 text-[1.03rem] leading-8">
              Our team will guide you through facilities, apartment
              availability, and tailored long-stay options for your lifestyle
              needs.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className={BTN_GOLD}>
                Arrange Viewing
              </Link>
              <Link href="/apartments" className={BTN_DARK}>
                Explore Apartments
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
