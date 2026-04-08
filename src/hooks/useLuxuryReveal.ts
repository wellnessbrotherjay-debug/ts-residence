"use client";

import { useEffect, useRef, useState } from "react";

type LuxuryRevealProfile = "subtle" | "cinematic" | "hero";

type UseLuxuryRevealOptions = {
  profile?: LuxuryRevealProfile;
  delayMs?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  activeClassName?: string;
};

export function useLuxuryReveal<T extends HTMLElement>({
  profile = "cinematic",
  delayMs = 0,
  threshold = 0.15,
  rootMargin = "-10% 0px",
  triggerOnce = true,
  activeClassName = "is-visible",
}: UseLuxuryRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.dataset.revealProfile = profile;
    node.style.setProperty("--reveal-delay", `${Math.max(delayMs, 0)}ms`);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        setIsVisible(true);
        node.classList.add(activeClassName);

        if (triggerOnce) {
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      node.classList.remove(activeClassName);
      node.style.removeProperty("--reveal-delay");
      delete node.dataset.revealProfile;
      setIsVisible(false);
    };
  }, [activeClassName, delayMs, profile, rootMargin, threshold, triggerOnce]);

  return {
    ref,
    isVisible,
  };
}
