"use client";

import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/HeroSection";
import { HomeHeadline } from "@/components/home/HomeHeadline";
import { HomePillars } from "@/components/home/HomePillars";
import { HomeResidents } from "@/components/home/HomeResidents";
import { HomeWhySeminyak } from "@/components/home/HomeWhySeminyak";
import { HomeApartments } from "@/components/home/HomeApartments";
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
    "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/99f4c935-885b-4314-5181-a1ad43657700/public";

  const apartments = [
    {
      name: "SOLO",
      sqm: "36",
      bed: "1 Bedroom",
      desc: "Compact luxury for solo explorers",
      img: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/52b605cf-2c98-48f3-cce2-b317f0dbd800/public",
      page: "solo" as Page,
    },
    {
      name: "STUDIO",
      sqm: "48",
      bed: "1 Bedroom",
      desc: "Spacious elegance for couples",
      img: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/f5609092-040f-47f7-b9f7-d3fd8c13be00/public",
      page: "studio" as Page,
    },
    {
      name: "SOHO",
      sqm: "80",
      bed: "2 Bedrooms",
      desc: "Ultimate space for families",
      img: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/2fef14ff-25f6-41d7-e15e-b19d9b793100/public",
      page: "soho" as Page,
    },
  ];

  return (
    <div className="w-full">
      <HeroSection heroImage={heroImage} showVideo={false} />
      <HomeHeadline setPage={setPage} />
      <HomePillars setPage={setPage} />
      <HomeWhySeminyak setPage={setPage} />
      <HomeResidents />
      <HomeApartments setPage={setPage} apartments={apartments} />
    </div>
  );
}
