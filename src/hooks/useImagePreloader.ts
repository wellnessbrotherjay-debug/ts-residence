"use client";

import { useEffect } from "react";

interface ImagePreloaderProps {
  srcs: string[];
  priority?: boolean;
}

export const useImagePreloader = ({ srcs, priority = false }: ImagePreloaderProps) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create preloading links
    const preloadLinks = srcs.map((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      if (priority) {
        link.fetchPriority = "high";
        link.crossOrigin = "anonymous";
      }
      document.head.appendChild(link);
      return link;
    });

    // Cleanup function to remove preloaded links
    return () => {
      preloadLinks.forEach((link) => {
        link.remove();
      });
    };
  }, [srcs, priority]);
};