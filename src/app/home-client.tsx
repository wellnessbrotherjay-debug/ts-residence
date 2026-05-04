"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apartmentDetailMap } from "@/lib/apartments-content";
import HeroSection from "@/components/HeroSection";
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

function HomeClient() {
  const router = useRouter();
  const [isQaExpanded, setIsQaExpanded] = useState(false);

  const setPage = (page: Page) => {
    router.push(pageToPath(page));
  };

  // Generate apartments array from apartmentDetailMap for robust mapping and gallery support
  const apartments = Object.entries(apartmentDetailMap).map(
    ([key, value]) => ({
      name: value.name,
      sqm: value.sqm.replace(" sqm", ""),
      bed: value.bed,
      desc: value.short,
      img: value.hero,
      page: key as Page,
    })
  );



  return (
    <>
      <HeroSection />
      <HomeHeadline setPage={setPage} />
      <HomePillars setPage={setPage} />
      <HomeResidents />
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
    </>
  );
}

export default HomeClient;
