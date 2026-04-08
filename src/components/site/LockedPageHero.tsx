"use client";

import type { ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

type LockedPageHeroProps = {
  image: string;
  alt: string;
  title: ReactNode;
  description?: ReactNode;
  heightClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentMaxClassName?: string;
};

export function LockedPageHero({
  image,
  alt,
  title,
  description,
  heightClassName = "h-[88vh] md:h-[90vh]",
  titleClassName = "mx-auto max-w-[12ch] font-serif text-[2.75rem] leading-[0.9] tracking-[-0.03em] text-white sm:text-7xl md:max-w-[14ch] md:text-[5.7rem] lg:text-[6.8rem]",
  descriptionClassName = "mx-auto mt-6 max-w-125 text-[0.97rem] leading-7 text-white/92 [text-shadow:0_2px_18px_rgba(0,0,0,0.38)] md:mt-9 md:max-w-190 md:text-[1.16rem] md:leading-9",
  contentMaxClassName = "w-full max-w-300 text-white",
}: LockedPageHeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const contentY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -56]), {
    stiffness: 96,
    damping: 26,
    mass: 0.42,
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0.74]);

  return (
    <section
      ref={heroRef}
      className={`border-gold/30 relative overflow-hidden border-y ${heightClassName}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="fixed inset-x-0 top-0 h-screen">
          <img src={image} alt={alt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/42" />
          <div className="absolute inset-0 bg-linear-to-b from-black/34 via-black/20 to-black/52" />
        </div>
      </div>

      <div className="relative h-full" />

      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center px-5 text-center md:px-12 lg:px-20 xl:px-28"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className={contentMaxClassName}>
          <div data-reveal-group="0.1">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.16, ease: "easeOut" }}
              className="via-gold/70 mx-auto h-px w-24 origin-center bg-linear-to-r from-transparent to-transparent"
            />

            <h1 className={`mt-6 ${titleClassName}`}>{title}</h1>

            {description ? (
              <p className={descriptionClassName}>{description}</p>
            ) : null}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
