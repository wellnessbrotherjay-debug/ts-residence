"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FadeInView } from "../animations";

const GALLERY_IMAGES = [
  {
    url: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/22f5b499-b941-4dca-11e3-239e22612200/public",
  },
  {
    url: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/363a5628-6c76-41fd-bac1-16127cdd1500/public",
  },
  {
    url: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/7b396216-4fa1-457b-b6bf-16588fa18400/public",
  },
  {
    url: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/d58a5695-63e7-4c36-7bf0-15b728034c00/public",
  },
  {
    url: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/331971d0-3b35-4fc1-4c33-6e1dc82fcd00/public",
  },
  {
    url: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/d44e04fa-07c2-4c4a-e25f-7082f2534e00/public",
  },
];

export const HomeGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      data-reveal-profile="cinematic"
      className="bg-cream-dark border-gold/25 border-b px-5 py-12 md:px-12 md:py-16 lg:px-20 lg:py-20 xl:px-28"
    >
      <FadeInView className="mx-auto max-w-240">
        <div className="text-center">
          <p className="label-caps text-gold">Gallery</p>
          <h2 className="text-ink mt-4 font-serif text-[1.95rem] leading-[1.04] md:text-[2.6rem]">
            Experience TS Residence
          </h2>
        </div>

        {/* Auto-Rotating Album */}
        <div className="mt-10">
          <div className="relative aspect-video overflow-hidden rounded-lg shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={GALLERY_IMAGES[currentIndex].url}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img
                  src={GALLERY_IMAGES[currentIndex].url}
                  alt={`Gallery image ${currentIndex + 1}`}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <motion.div
                key={currentIndex}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "linear" }}
                className="h-full bg-white"
              />
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {GALLERY_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === currentIndex ? "bg-white scale-125" : "bg-white/50"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </FadeInView>
    </section>
  );
};
