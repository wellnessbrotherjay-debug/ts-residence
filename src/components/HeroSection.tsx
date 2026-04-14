import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { FadeInView } from "./site/animations";
import { useState, useEffect, useRef } from "react";

const HERO_DEMO_VIDEO_SRC =
  "https://www.hive68.com/wp-content/uploads/2019/10/Clip-1.mp4";
const HERO_VIDEO_SRC = HERO_DEMO_VIDEO_SRC;

const DESKTOP_NAVBAR_H = 128;
const MOBILE_NAVBAR_H = 72;

// --- Shared text content for dual-header technique ---
const HeroTextContent = ({
  slides,
  currentSlide,
  isDark,
  isInitialLoad,
}: {
  slides: { tag: string; title: string; subtitle: string }[];
  currentSlide: number;
  isDark: boolean;
  isInitialLoad: boolean;
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={currentSlide}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: isInitialLoad ? 1.1 : 0.35,
        ease: isInitialLoad ? [0.22, 1, 0.36, 1] : "easeOut",
      }}
      className="flex flex-col items-center text-center"
    >
      <FadeInView delay={isInitialLoad ? 0.16 : 0.02}>
        <span
          className={`font-sans text-[10px] font-semibold tracking-[0.28em] uppercase sm:text-[12px] md:text-[18px] ${
            isDark ? "text-ink" : "text-white"
          }`}
        >
          {slides[currentSlide].tag}
        </span>
      </FadeInView>
      <FadeInView delay={isInitialLoad ? 0.24 : 0.06}>
        <h1
          className={`heading-display text-[2.8rem] leading-[0.92] sm:text-[3.35rem] md:text-8xl lg:text-[9.2rem] xl:text-[11.5rem] ${
            isDark ? "text-ink" : "text-white"
          }`}
          style={
            isDark
              ? {}
              : {
                  textShadow:
                    "0 4px 50px rgba(0,0,0,0.4), 0 2px 12px rgba(0,0,0,0.25)",
                }
          }
        >
          {slides[currentSlide].title}
        </h1>
      </FadeInView>
    </motion.div>
  </AnimatePresence>
);

export const HeroSection = ({
  heroImage,
  showVideo = true,
}: {
  heroImage: string;
  showVideo?: boolean;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [videoSrc, setVideoSrc] = useState(showVideo ? HERO_VIDEO_SRC : "");
  const heroRef = useRef<HTMLDivElement>(null);
  const textMeasureRef = useRef<HTMLDivElement>(null);

  // viewportH drives all pixel-based layout values.
  const [viewportH, setViewportH] = useState(900);
  const [navbarH, setNavbarH] = useState(MOBILE_NAVBAR_H);
  const textRestOffset = navbarH >= DESKTOP_NAVBAR_H ? 220 : 185;

  useEffect(() => {
    const measure = () => {
      setViewportH(window.innerHeight);
      setNavbarH(
        window.innerWidth >= 1024 ? DESKTOP_NAVBAR_H : MOBILE_NAVBAR_H,
      );
    };
    measure();
    // Re-measure after fonts have settled
    const t = setTimeout(measure, 200);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Keep the media full-bleed from the first frame. The previous staged reveal
  // made the hero feel like it was expanding open on load.
  const imageTop = "0px";
  const whiteTextAbsTop = "0px";

  // Other scroll-driven animations
  const textY = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6],
    [textRestOffset, textRestOffset - 18, textRestOffset - 84],
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45],
    [1, 0.85, 0],
  );
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.93]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imageWidth = "100%";
  const imageBorderRadius = "0px";
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.22, 0.48],
    [0.1, 0.28, 0.55, 0.75],
  );
  const heroExitOpacity = useTransform(scrollYProgress, [0.78, 1.0], [1, 0]);

  const slides = [
    {
      tag: "Welcome To",
      title: "TS Residence",
      subtitle: "Five-star living in the heart of Seminyak",
    },
    {
      tag: "Experience",
      title: "Healthy Living",
      subtitle: "Wellness, recovery, and mindful living — all under one roof",
    },
    {
      tag: "Discover",
      title: "Easy Living",
      subtitle: "Monthly apartments with zero stress, minutes from the beach",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showVideo) {
      queueMicrotask(() => {
        setVideoSrc("");
        setIsVideoReady(false);
        setHasVideoError(false);
      });
      return;
    }
    queueMicrotask(() => {
      setVideoSrc(HERO_VIDEO_SRC);
    });
  }, [showVideo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div
      ref={heroRef}
      data-no-global-reveal="true"
      className="relative"
      style={{
        position: "relative",
        height: `${Math.round(viewportH * (navbarH >= DESKTOP_NAVBAR_H ? 1.7 : 1.12))}px`,
      }}
    >
      {/* Sticky container — one viewport tall in pixels */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: `${viewportH}px` }}
      >
        <motion.div
          style={{ opacity: heroExitOpacity }}
          className="absolute inset-0"
        >
          {/* LAYER 1: Cream background + Dark text */}
          <div className="bg-cream absolute inset-0 z-10">
            <div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
              style={{ paddingTop: `${navbarH}px` }}
            >
              {/* Motion is applied directly to the text content div, not a full-screen wrapper.
                  This ensures scale/y transforms originate from the text block itself —
                  the same origin used by the white text copy in Layer 2. */}
              <motion.div
                ref={textMeasureRef}
                style={{
                  y: textY,
                  opacity: textOpacity,
                  scale: textScale,
                }}
                className="pointer-events-auto"
              >
                <HeroTextContent
                  slides={slides}
                  currentSlide={currentSlide}
                  isDark={false}
                  isInitialLoad={isInitialLoad}
                />
              </motion.div>
            </div>
          </div>

          {/* LAYER 2: Image + White text (clips to image bounds) */}
          <motion.div
            style={{ top: imageTop }}
            className="absolute right-0 bottom-0 left-0 z-20 overflow-hidden"
          >
            {/* Image frame — fills layer2 height, starts narrow, expands to full bleed */}
            <motion.div
              style={{
                scale: imageScale,
                width: imageWidth,
                borderRadius: imageBorderRadius,
              }}
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 overflow-hidden"
            >
              <img
                src={heroImage}
                alt="TS Residence"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {videoSrc && !hasVideoError && (
                <video
                  key={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={heroImage}
                  onCanPlay={() => setIsVideoReady(true)}
                  onError={() => {
                    if (videoSrc !== HERO_DEMO_VIDEO_SRC) {
                      setIsVideoReady(false);
                      setVideoSrc(HERO_DEMO_VIDEO_SRC);
                      return;
                    }
                    setHasVideoError(true);
                  }}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    isVideoReady ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
              )}
              <motion.div
                style={{ opacity: overlayOpacity }}
                className="absolute inset-0 bg-black/70"
              />
            </motion.div>

            {/* White text — outer div pinned at viewport y=0 (top = -currentImageTop),
                layer2's overflow:hidden clips it to the image area.
                Motion (y/opacity/scale) lives on the inner content div — identical
                to the dark text content div — so both share the same transform origin. */}
            <motion.div
              className="pointer-events-none absolute right-0 left-0 flex flex-col items-center justify-center"
              style={{
                top: whiteTextAbsTop,
                paddingTop: `${navbarH}px`,
              }}
            >
              <motion.div
                style={{
                  y: textY,
                  opacity: textOpacity,
                  scale: textScale,
                }}
                className="pointer-events-auto"
              >
                <HeroTextContent
                  slides={slides}
                  currentSlide={currentSlide}
                  isDark={false}
                  isInitialLoad={isInitialLoad}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Slide Indicators */}
          <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 md:bottom-8 md:gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-700 ${
                  i === currentSlide
                    ? "bg-gold h-3.5 w-7 md:h-6 md:w-10"
                    : "h-3.5 w-3.5 bg-white/30 hover:bg-white/50 md:h-6 md:w-6"
                }`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            style={{ opacity: textOpacity }}
            className="absolute right-8 bottom-8 z-30 hidden flex-col items-center gap-2 md:flex"
          >
            <span className="font-sans text-[10px] tracking-[0.3em] text-white/40 uppercase [writing-mode:vertical-lr]">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-8 w-px bg-linear-to-b from-white/40 to-transparent"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
