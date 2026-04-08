"use client";

import {
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";

type UseParallaxImageOptions = {
  yStart?: number;
  scaleStart?: number;
  blurStart?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

export function useParallaxImage<T extends HTMLElement>({
  yStart = 20,
  scaleStart = 1.08,
  blurStart = 4,
  stiffness = 82,
  damping = 22,
  mass = 0.42,
}: UseParallaxImageOptions = {}) {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 35%"],
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [yStart, 0]);
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [scaleStart, 1]);
  const blurRaw = useTransform(scrollYProgress, [0, 1], [blurStart, 0]);

  const y = useSpring(yRaw, { stiffness, damping, mass });
  const scale = useSpring(scaleRaw, { stiffness, damping, mass });
  const blur = useSpring(blurRaw, { stiffness, damping, mass });

  const filter = useMotionTemplate`blur(${blur}px)`;

  const style = prefersReducedMotion
    ? {
        y: 0,
        scale: 1,
        filter: "none" as const,
      }
    : {
        y,
        scale,
        filter,
      };

  return {
    ref,
    style,
  };
}
