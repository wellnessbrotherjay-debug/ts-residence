"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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

const seminyakReasons = [
  {
    title: "Strategically located with fast access to everything",
    Icon: MapPinned,
  },
  {
    title: "Safe, expat-friendly, and walkable",
    Icon: ShieldCheck,
  },
  {
    title:
      "Vibrant mix of culture, wellness, dining, and digital-friendly cafes",
    Icon: Sparkles,
  },
  {
    title: "Well-developed infrastructure (hospital, co-working, retail)",
    Icon: Building2,
  },
];

const easyMoments = [
  {
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp",
    caption: "Your stable monthly base in the heart of Seminyak.",
  },
  {
    image:
      "https://tsresidence.id/wp-content/uploads/2025/08/panoramic-view-of-sunset-on-a-beah-near-tsresidence-scaled.webp",
    caption: "Morning commute: Just 5 minutes to Seminyak Beach.",
  },
  {
    image:
      "https://tsresidence.id/wp-content/uploads/2025/08/woman-bathing-at-TS-suite-rooftop-pool-during-a-beautiful-sunset.webp",
    caption: "Daily access to rooftop recovery and wellness.",
  },
  {
    image:
      "https://tsresidence.id/wp-content/uploads/2025/09/46cef01afe76ce46f8019d0f518ea165.jpg",
    caption: "Refined interiors designed for real-life productivity.",
  },
];

const inclusions = [
  "Fully Furnished Modern Units",
  "Rooftop Pool & Sunset Deck Access",
  "Fully Equipped Gym & Recovery Center",
  "Dedicated Restaurant & Business Lounge",
  "Secure Parking for Car or Scooter",
  "24/7 Security & Keycard Access",
  "High-Speed Fiber Internet & TV",
  "Water & Concierge Services",
];

const tailoredServices = [
  {
    title: "Housekeeping",
    description: "Periodic cleaning to keep your space fresh and effortless.",
  },
  {
    title: "Laundry Service",
    description: "Professional wash and fold handled by our on-site team.",
  },
  {
    title: "Daily Breakfast",
    description: "Nutritious morning options at our dedicated restaurant.",
  },
];

const residenceFacilities = [
  {
    title: "TS Suites Coworking",
    description:
      "A professional environment for focus and global connectivity, just levels away.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    label: "Productivity",
  },
  {
    title: "No.1 Wellness Club",
    description:
      "Full access to recovery facilities including sauna, ice bath, and premium gym.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    label: "Recovery",
  },
  {
    title: "Rooftop Pool & Bar",
    description:
      "Elevated relaxation with panoramic Seminyak views and signature service.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
    label: "Lifestyle",
  },
  {
    title: "TSTORE & Retail",
    description:
      "Curated fashion and essential retail directly within the residence complex.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    label: "Convenience",
  },
];

const seminyakHighlights = [
  {
    title: "TS Suites Hotel",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-suites-hotel.webp",
    href: "https://tssuites.com/",
  },
  {
    title: "Strategic Location",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/couple-walking-around-seminyak-e1761017959269.webp",
  },
  {
    title: "No.1 Wellness Club",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-healthy-living-tsc-yoga-class.webp",
  },
  {
    title: "Free Shuttle Service",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/shuttle-bus-service-by-ts-suites-scaled.webp",
  },
  {
    title: "Seminyak Beach",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/08/a-surfer-walking-under-the-sunset-near-ts-residence.webp",
  },
  {
    title: "Double Six Beach",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/08/lots-of-umbrellas-on-the-beach-during-sunset.webp",
  },
  {
    title: "TSTORE",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-store-img.webp",
  },
  {
    title: "Restaurant",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/09/mama-san-restaurant-near-ts-residence.jpg",
  },
  {
    title: "Nightlife",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/09/kudeta-night-club-near-ts-residence.jpg",
  },
  {
    title: "Entertainment",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/09/woobar-near-ts-residence.jpg",
  },
  {
    title: "Beach Club",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/09/potato-head-beach-club-near-ts-residence.jpg",
  },
  {
    title: "10 min to Hospital",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/siloam-hospital-denpasar-ts-suites-e1761018247329.webp",
  },
  {
    title: "20 min to Ngurah Rai Airport",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/ngurah-rai-airport-bali-ts-residence.webp",
  },
  {
    title: "Shopping Center, Dining & Entertainment",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/Beachwalk-shopping-center-kuta.webp",
  },
  {
    title: "Easy Accessibility",
    image:
      "https://tsresidence.id/wp-content/uploads/2025/10/Bali-mandara-highway.webp",
  },
];

export default function Page() {
  const [galleryIndex, setGalleryIndex] = useState<number>(-1);
  const heroRef = useRef<HTMLElement | null>(null);
  const highlightsRailRef = useRef<HTMLDivElement | null>(null);
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

  const scrollHighlights = (direction: -1 | 1) => {
    const rail = highlightsRailRef.current;
    if (!rail) return;

    rail.scrollBy({
      left: rail.clientWidth * 0.82 * direction,
      behavior: "smooth",
    });
  };

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
    <div className="bg-cream overflow-x-hidden text-black">
      <section
        ref={heroRef}
        className="border-gold/30 text-over-image relative min-h-[48vh] overflow-hidden border-y md:min-h-[78vh] lg:min-h-[92vh]"
      >
        <motion.img
          src="https://tsresidence.id/wp-content/uploads/2025/08/woman-bathing-at-TS-suite-rooftop-pool-during-a-beautiful-sunset.webp"
          alt="Live in the heart of Seminyak"
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
          <div data-reveal-group="0.1" className="w-full max-w-300 text-white">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
              className="via-gold/80 mx-auto h-px w-28 origin-center bg-linear-to-r from-transparent to-transparent"
            />

            <h1 className="mx-auto mt-6 max-w-[11ch] font-serif text-[2.85rem] leading-[0.9] tracking-[-0.03em] text-white sm:text-7xl md:mt-7 md:max-w-[12ch] md:text-[6rem] lg:text-[7rem]">
              Live in the Heart
              <br />
              of Seminyak
            </h1>

            <p className="mx-auto mt-6 max-w-125 text-[0.97rem] leading-7 text-white/92 [text-shadow:0_2px_18px_rgba(0,0,0,0.38)] md:mt-9 md:max-w-190 md:text-[1.16rem] md:leading-9">
              Where everyday convenience meets world-class lifestyle, all within
              walking distance.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
              Discover More
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="from-gold/60 h-10 w-px bg-linear-to-b to-transparent"
            />
          </div>
        </motion.div>
      </section>

      <section className="border-gold/30 relative overflow-hidden border-b bg-white">
        <div className="pointer-events-none absolute top-10 -right-88 hidden opacity-[0.07] lg:block">
          <img
            src="https://tsresidence.id/wp-content/uploads/2025/08/bali-island-outline.svg"
            alt=""
            className="w-216 max-w-none"
          />
        </div>

        <div className="section-shell relative px-6 py-16 md:px-12 md:py-18 lg:px-20 lg:py-22 xl:px-28">
          <FadeInView className="mx-auto max-w-4xl text-center">
            <p className="label-caps text-gold">Why Seminyak</p>
            <h2 className="mt-4 font-serif text-[2.2rem] leading-[1.03] font-normal text-black md:text-[3rem]">
              Why Seminyak for long-term stay?
            </h2>
          </FadeInView>

          <StaggerContainer
            className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-4"
            staggerDelay={0.16}
          >
            {seminyakReasons.map((item) => (
              <StaggerItem
                key={item.title}
                className="group border-gold/25 bg-cream/90 border px-6 py-7 transition-all duration-900 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(28,25,23,0.1)] md:px-7 md:py-8"
              >
                <div className="text-gold-dark flex h-12 w-12 items-center justify-center rounded-full border border-current/15 bg-white/80 transition-transform duration-700 group-hover:scale-105">
                  <item.Icon className="h-5 w-5" strokeWidth={1.7} />
                </div>
                <div className="from-gold/30 via-gold/15 mt-5 h-px w-full bg-linear-to-r to-transparent" />
                <p className="mt-5 text-[1rem] leading-8 font-normal text-black">
                  {item.title}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-gold/30 bg-cream border-b">
        <div className="section-shell px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28 xl:px-28">
          <div>
            <FadeInView className="mx-auto max-w-5xl text-center">
              <span className="label-caps text-gold">Easy Living</span>
              <h2 className="mt-5 font-serif text-[2.5rem] leading-[1.08] font-normal tracking-tight text-black md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem]">
                Breathtaking Beaches at Your Doorstep
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-black">
                Live with direct access to Seminyak&apos;s beaches, wellness,
                dining, retail, nightlife, and the practical infrastructure that
                makes long stays feel effortless.
              </p>
            </FadeInView>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            <div className="order-1 hidden lg:block">
              <button
                type="button"
                onClick={() => scrollHighlights(-1)}
                className="border-gold/30 text-ink hover:border-gold hover:text-gold-dark flex h-12 w-12 items-center justify-center border bg-white transition-colors duration-300"
                aria-label="Scroll destinations left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={highlightsRailRef}
              className="order-3 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 lg:order-2"
            >
              {seminyakHighlights.map((item, index) => (
                <article
                  key={item.title}
                  className="group max-w-92 min-w-[18rem] snap-start"
                >
                  <FadeInView delay={Math.min(index * 0.04, 0.28)}>
                    <div className="border-gold/20 overflow-hidden border bg-white shadow-[0_20px_60px_rgba(28,25,23,0.08)]">
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="relative aspect-4/5 overflow-hidden block">
                          <motion.img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.06]"
                            whileHover={{ scale: 1.06 }}
                            transition={{
                              duration: 1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/62 via-black/8 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                            <p className="text-gold-light text-[10px] font-semibold tracking-[0.22em] uppercase">
                              Seminyak Access
                            </p>
                            <h3 className="mt-3 font-serif text-[1.9rem] leading-[1.04] text-white">
                              {item.title}
                            </h3>
                          </div>
                        </a>
                      ) : (
                        <div className="relative aspect-4/5 overflow-hidden">
                          <motion.img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.06]"
                            whileHover={{ scale: 1.06 }}
                            transition={{
                              duration: 1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/62 via-black/8 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                            <p className="text-gold-light text-[10px] font-semibold tracking-[0.22em] uppercase">
                              Seminyak Access
                            </p>
                            <h3 className="mt-3 font-serif text-[1.9rem] leading-[1.04] text-white">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                  </FadeInView>
                </article>
              ))}
            </div>

            <div className="order-2 flex items-center justify-end gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => scrollHighlights(-1)}
                className="border-gold/30 text-ink hover:border-gold hover:text-gold-dark flex h-12 w-12 items-center justify-center border bg-white transition-colors duration-300"
                aria-label="Scroll destinations left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollHighlights(1)}
                className="border-gold/30 text-ink hover:border-gold hover:text-gold-dark flex h-12 w-12 items-center justify-center border bg-white transition-colors duration-300"
                aria-label="Scroll destinations right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="order-4 hidden lg:block">
              <button
                type="button"
                onClick={() => scrollHighlights(1)}
                className="border-gold/30 text-ink hover:border-gold hover:text-gold-dark flex h-12 w-12 items-center justify-center border bg-white transition-colors duration-300"
                aria-label="Scroll destinations right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <FadeInView className="mt-10">
            <a
              href="https://wa.me/6281119028111?text=Hello!%20I%20want%20to%20book%20an%20apartment.%20Can%20you%20help%20me%20please%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="border-gold bg-gold hover:bg-gold-dark inline-flex min-h-12 items-center justify-center border px-7 py-3.5 text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition-all duration-400 md:min-h-13.5 md:px-9 md:py-4 md:text-[12px] md:tracking-[0.22em]"
            >
              Book Apartment
            </a>
          </FadeInView>
        </div>
      </section>

      <section className="bg-cream border-gold/30 overflow-hidden border-b py-14">
        <div className="section-shell px-6 md:px-12 lg:px-20 xl:px-28">
          <FadeInView className="mb-14 max-w-280">
            <span className="label-caps text-gold">Resident Access</span>
            <h2 className="mt-4 font-serif text-4xl font-normal text-black md:text-5xl lg:text-6xl">
              The Five-Star Ecosystem
            </h2>
            <p className="mt-8 max-w-2xl text-lg text-black">
              Easy Living at TS Residence means having Seminyak&apos;s most
              refined facilities right in your building. From high-focus work
              zones to deep recovery spaces, your lifestyle is self-contained
              and superior.
            </p>
          </FadeInView>

          <StaggerContainer
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            staggerDelay={0.12}
          >
            {residenceFacilities.map((facility) => (
              <StaggerItem
                key={facility.title}
                className="group border-gold/25 overflow-hidden border bg-white"
              >
                <div className="aspect-16/10 overflow-hidden lg:aspect-square">
                  <motion.img
                    src={facility.image}
                    alt={facility.title}
                    className="h-full w-full object-cover transition-transform duration-1900 group-hover:scale-105"
                  />
                </div>
                <div className="p-7">
                  <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase">
                    {facility.label}
                  </span>
                  <h3 className="text-ink mt-3 font-serif text-2xl">
                    {facility.title}
                  </h3>
                  <p className="mt-4 text-[0.9rem] leading-6 text-black">
                    {facility.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="section-shell px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28 xl:px-28">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <FadeInView direction="left">
              <span className="label-caps text-gold/80">Monthly Privilege</span>
              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Included in
                <br />
                your monthly stay.
              </h2>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/60">
                Easy Living means more than just a room. You gain full access to
                the lifestyle and wellness ecosystem of TS Residence, ensuring
                every day is productive and restorative.
              </p>
              <div className="mt-12">
                <Link href="/contact" className={BTN_GOLD}>
                  Inquire Now
                </Link>
              </div>
            </FadeInView>

            <FadeInView direction="right">
              <div className="grid grid-cols-1 gap-y-6 border-t border-white/10 pt-2 sm:grid-cols-2 sm:gap-x-12">
                {inclusions.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 border-b border-white/10 py-5"
                  >
                    <div className="bg-gold h-1.5 w-1.5 rounded-full" />
                    <span className="text-sm font-medium tracking-wide text-white/90">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      <section className="border-gold/30 border-b bg-white">
        <div className="section-shell px-6 py-20 md:px-12 md:py-24 lg:px-20 lg:py-28 xl:px-28">
          <FadeInView className="mb-16 text-center">
            <span className="label-caps text-gold">Extra Value</span>
            <h2 className="mt-4 font-serif text-3xl font-normal text-black md:text-4xl lg:text-5xl">
              Tailored Services for Easy Life
            </h2>
          </FadeInView>

          <StaggerContainer
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            staggerDelay={0.12}
          >
            {tailoredServices.map((service) => (
              <StaggerItem
                key={service.title}
                className="group border-gold/20 bg-cream border p-8 transition-shadow duration-700 hover:shadow-xl md:p-10"
              >
                <h3 className="font-serif text-2xl font-normal text-black">
                  {service.title}
                </h3>
                <div className="bg-gold/40 my-6 h-px w-12 transition-all duration-700 group-hover:w-full" />
                <p className="text-[0.95rem] leading-7 text-black">
                  {service.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-gold/30 bg-cream border-b">
        <div className="w-full px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28">
          <StaggerContainer
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
            staggerDelay={0.09}
          >
            {easyMoments.map((moment, index) => (
              <StaggerItem
                key={moment.image}
                className="group border-gold/25 overflow-hidden border bg-white"
              >
                <button
                  onClick={() => setGalleryIndex(index)}
                  className="relative block h-full w-full cursor-pointer appearance-none overflow-hidden border-0 bg-transparent p-0"
                  aria-label={`Open gallery image ${index + 1}`}
                >
                  <motion.img
                    src={moment.image}
                    alt={moment.caption}
                    className="aspect-4/3 w-full object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.06]"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="border border-white/40 bg-black/20 px-4 py-2 text-[10px] tracking-[0.2em] text-white uppercase backdrop-blur-sm">
                      View Moment
                    </span>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeInView className="mx-auto mt-14 w-full max-w-280 text-center">
            <p className="mx-auto max-w-230 text-[1.05rem] leading-8 text-black md:text-[1.16rem] md:leading-9">
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

            <figure
              key={easyMoments[galleryIndex].image}
              className="relative w-full max-w-330"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={easyMoments[galleryIndex].image}
                alt={easyMoments[galleryIndex].caption}
                className="max-h-[82vh] w-full object-contain"
              />
              <figcaption className="mt-6 text-center">
                <p className="text-[13px] font-medium tracking-[0.04em] text-white/90 md:text-[15px]">
                  {easyMoments[galleryIndex].caption}
                </p>
                <p className="mt-3 text-[10px] tracking-[0.18em] text-white/40 uppercase">
                  {galleryIndex + 1} / {easyMoments.length}
                </p>
              </figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
