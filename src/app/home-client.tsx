"use client";

import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/HeroSection";
import { HomeHeadline } from "@/components/home/HomeHeadline";
import { HomePillars } from "@/components/home/HomePillars";
import { HomeWhySeminyak } from "@/components/home/HomeWhySeminyak";
import { HomeApartments } from "@/components/home/HomeApartments";
import { HomeOffers } from "@/components/home/HomeOffers";
import { HomeYourHome } from "@/components/home/HomeYourHome";
import type { Page } from "@/types";

function pageToPath(page: Page): string {
  if (page === "home") return "/";
  if (page === "apartments") return "/apartments";
  if (page === "offers") return "/offers";
  if (page === "gallery") return "/gallery";
  if (page === "contact") return "/contact";
  if (page === "five-star") return "/five-star-living";
  if (page === "healthy") return "/healthy-living";
  if (page === "easy") return "/easy-living";
  if (page === "solo") return "/apartments/solo";
  if (page === "studio") return "/apartments/studio";
  if (page === "soho") return "/apartments/soho";
  if (page === "admin") return "/";
  return "/";
}

export function HomeClient() {
  const router = useRouter();
  const setPage = (page: Page) => {
    router.push(pageToPath(page));
  };

  const heroImage =
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=70";

  const apartments = [
    {
      name: "SOLO",
      sqm: "36",
      bed: "1 Bedroom",
      desc: "Compact luxury for solo explorers",
      img: "https://picsum.photos/seed/solo-apt/1920/1080",
      page: "solo" as Page,
    },
    {
      name: "STUDIO",
      sqm: "48",
      bed: "1 Bedroom",
      desc: "Spacious elegance for couples",
      img: "https://picsum.photos/seed/studio-apt/1920/1080",
      page: "studio" as Page,
    },
    {
      name: "SOHO",
      sqm: "80",
      bed: "2 Bedrooms",
      desc: "Ultimate space for families",
      img: "https://picsum.photos/seed/soho-apt/1920/1080",
      page: "soho" as Page,
    },
  ];

  return (
    <div className="w-full">
      <HeroSection heroImage={heroImage} />
      <HomeHeadline setPage={setPage} />
      <HomePillars setPage={setPage} />
      <HomeWhySeminyak
        setPage={setPage}
        imgSrc="https://picsum.photos/seed/seminyak-pool/1600/1800"
      />
      <HomeApartments setPage={setPage} apartments={apartments} />
      <HomeOffers setPage={setPage} />
      <HomeYourHome
        setPage={setPage}
        imgSrc="https://picsum.photos/seed/young-family/1200/1600"
      />
    </div>
  );
}
