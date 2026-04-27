"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { HomeHeadline } from "@/components/home/HomeHeadline";
import { HomePillars } from "@/components/home/HomePillars";
import { HomeResidents } from "@/components/home/HomeResidents";
import { HomeWhySeminyak } from "@/components/home/HomeWhySeminyak";
import { HomeApartments } from "@/components/home/HomeApartments";
import { ChevronDown } from "lucide-react";
import type { Page } from "@/types";

function pageToPath(page: Page): string {
  if (page === "home") return "/";
  if (page === "apartments") return "/apartments";
  if (page === "offers") return "/offers";
  if (page === "gallery") return "/gallery";
  if (page === "contact") return "/contact";
  if (page === "faq") return "/faq";
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
  const [isQaExpanded, setIsQaExpanded] = useState(false);

  const setPage = (page: Page) => {
    router.push(pageToPath(page));
  };

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
      <HeroSection />
      <HomeHeadline setPage={setPage} />
      <HomePillars setPage={setPage} />
      <HomeApartments setPage={setPage} apartments={apartments} />
      <HomeWhySeminyak setPage={setPage} />

      {/* Collapsible Q&A Section */}
      <section className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <button
          onClick={() => {
            setIsQaExpanded(!isQaExpanded);
            if (!isQaExpanded) {
              setPage("faq");
            }
          }}
          className="group mx-auto flex w-full max-w-md items-center justify-center gap-3 rounded-full border-2 border-gold/30 bg-white px-8 py-4 transition-all duration-300 hover:border-gold hover:shadow-lg"
          aria-expanded={isQaExpanded}
        >
          <span className="font-serif text-lg font-semibold text-gold-dark">
            Questions &amp; Answers
          </span>
          <ChevronDown
            className={`text-gold transition-transform duration-300 ${isQaExpanded ? "rotate-180" : ""}`}
            size={20}
          />
        </button>
      </section>

      <HomeResidents />
    </div>
  );
}
