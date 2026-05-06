

import Link from "next/link";
import Image from "next/image";
import "./home-hero.css";

const HERO_IMAGES = [
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/e21d0685-e347-4234-84bf-5e5c84170a00/public",
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/3f554a00-be28-469b-2514-1a37ae5ff000/public",
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/12154d04-cda4-4f32-0e93-216f2d4d6a00/public",
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/8a973f26-d47d-48b1-a369-95c0c042ba00/public",
];

import { useState, useEffect } from "react";

const HERO_CONTENT = [
  {
    title: "TS RESIDENCE",
    subtitle: "A new living concept by TS Suites",
  },
  {
    title: "Five-star living",
    subtitle:
      "Enjoy full access to TS Suites Hotel — rooftop infinity pool, 24/7 gym, leisure club, salon, and designer retail — all just steps from your door.",
  },
  {
    title: "Healthy living",
    subtitle:
      "From daily yoga and reformer Pilates to sauna, cold bath, and IV therapy — everything is designed to help you feel your best, every day.",
  },
  {
    title: "Easy living",
    subtitle:
      "Located in central Seminyak with direct access to Sunset Road, flexible monthly leases, 24/7 security, and everything you need within minutes.",
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        setTransitioning(false);
      }, 800); // Half of transition duration
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Map images to content (if more images than content, fallback to first)
  const content = HERO_CONTENT[currentIndex] || HERO_CONTENT[0];

  return (
    <section className="home-hero">
      <div className="home-hero__media">
        <Image
          src={HERO_IMAGES[currentIndex]}
          alt={content.title}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className={`home-hero__image ${transitioning ? 'transitioning' : ''}`}
          quality={100}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        />
      </div>
      <div className="home-hero__overlay" />
      <div className="home-hero__center">
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </div>
      <div className="home-hero__bottom">
        <div className="home-hero__tabs">
          <Link href="/apartments">APARTMENTS</Link>
          <Link href="/five-star-living">FIVE-STAR LIVING</Link>
          <Link href="/healthy-living">HEALTHY LIVING</Link>
          <Link href="/easy-living">EASY LIVING</Link>
        </div>
        <div className="home-hero__actions">
          <Link href="/contact" className="home-hero__btn home-hero__btn--primary">BOOK</Link>
          <Link href="/apartments" className="home-hero__btn home-hero__btn--ghost">EXPLORE MORE</Link>
        </div>
      </div>
    </section>
  );
}
