"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface RotatingAlbumProps {
  images: string[];
  title: string;
  autoRotate?: boolean;
  rotateInterval?: number;
  className?: string;
}

const RotatingAlbum = ({
  images,
  title,
  autoRotate = true,
  rotateInterval = 3000,
  className = "",
}: RotatingAlbumProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 for next, -1 for prev
  // (isSliding state removed; cross-fade uses isFading)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMobileRef = useRef(false);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 1024;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-rotate functionality
  useEffect(() => {
    if (!autoRotate || !isMobileRef.current || images.length <= 1) return;

    const startRotation = () => {
      intervalRef.current = setInterval(() => {
        setPrevIndex(currentIndex => {
          const safeIndex = typeof currentIndex === "number" ? currentIndex : 0;
          const nextIndex = (safeIndex + 1) % images.length;
          setDirection(1);
          setCurrentIndex(nextIndex);
          return safeIndex;
        });
      }, rotateInterval);
    };

    startRotation();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRotate, rotateInterval, images.length]);

  // handleNextImage removed (sliding logic replaced by cross-fade)

  // prevImage removed (sliding logic replaced by cross-fade)

  // ...existing code...
  // Ensure all hooks and logic above

  // --- Cross-fade State ---
  const [isFading, setIsFading] = useState(false);
  const [fadeIndex, setFadeIndex] = useState(currentIndex);
  const transitionMs = 900;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Start auto-fade
  useEffect(() => {
    if (!autoRotate || images.length < 2) return;
    timeoutRef.current = setTimeout(() => {
      setFadeIndex((prev) => (prev + 1) % images.length);
      setIsFading(true);
    }, rotateInterval);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [autoRotate, rotateInterval, images.length, currentIndex]);

  // After fade animation, update index
  useEffect(() => {
    if (!isFading) return;
    const t = setTimeout(() => {
      setCurrentIndex(fadeIndex);
      setIsFading(false);
    }, transitionMs);
    return () => clearTimeout(t);
  }, [isFading, fadeIndex, transitionMs]);

  const currentImage = images[currentIndex];
  const nextImage = images[fadeIndex];

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(${currentImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "transparent",
      }}
    >
      {/* Current image always visible */}
      <Image
        src={currentImage}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center absolute inset-0 w-full h-full transition-opacity duration-0"
        style={{ opacity: isFading ? 1 : 1, zIndex: 1 }}
        draggable={false}
      />
      {/* Next image fades in over current */}
      {isFading && (
        <Image
          src={nextImage}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover object-center absolute inset-0 w-full h-full transition-opacity"
          style={{
            opacity: isFading ? 1 : 0,
            zIndex: 2,
            transition: `opacity ${transitionMs}ms cubic-bezier(0.77,0,0.175,1)`
          }}
          draggable={false}
        />
      )}
    </div>
  );
}

export default RotatingAlbum;