"use client";

import { useRouter } from "next/navigation";
import { HomePage } from "@/sections/HomePage";
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

  return <HomePage setPage={setPage} />;
}
