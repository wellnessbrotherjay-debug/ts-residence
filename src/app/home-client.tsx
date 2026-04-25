"use client";

import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/HeroSection";
import { HomeHeadline } from "@/components/home/HomeHeadline";
import { HomePillars } from "@/components/home/HomePillars";
import { HomeResidents } from "@/components/home/HomeResidents";
import { HomeWhySeminyak } from "@/components/home/HomeWhySeminyak";
import { HomeApartments } from "@/components/home/HomeApartments";
import Link from "next/link";
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
    "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/7aef4db4-582a-4beb-c3f9-5934b61e2200/public";

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

      {/* FAQ Section - before Footer */}
      <section
        id="faq"
        className="mx-auto max-w-3xl px-4 py-12 md:py-16 border-t border-gold/20 mt-16"
        aria-labelledby="faq-title"
      >
        <h2
          id="faq-title"
          className="font-serif text-2xl md:text-3xl font-semibold text-gold-dark mb-8 text-center tracking-tight"
        >
          Frequently Asked Questions
        </h2>
        <dl className="space-y-7">
          <div>
            <dt className="font-sans text-base font-semibold text-ink mb-1">Do you offer monthly rentals in Seminyak?</dt>
            <dd className="text-base text-neutral-700">Yes. TS Residence offers fully furnished monthly rental apartments in Seminyak, Bali, designed for long-stay guests, digital nomads, professionals, and residents who want a flexible stay.</dd>
          </div>
          <div>
            <dt className="font-sans text-base font-semibold text-ink mb-1">What apartment types are available?</dt>
            <dd className="text-base text-neutral-700">TS Residence offers <Link href="/apartments" className="text-gold underline hover:text-gold-dark">SOLO, STUDIO, and SOHO apartments</Link>. SOLO is ideal for one person, STUDIO offers more space for longer stays, and SOHO is designed for guests who need more room or a work-living setup.</dd>
          </div>
          <div>
            <dt className="font-sans text-base font-semibold text-ink mb-1">Are the apartments fully furnished?</dt>
            <dd className="text-base text-neutral-700">Yes. The apartments are fully furnished and ready to live in, including essential room features, air conditioning, WiFi, kitchen facilities, and access to TS Suites facilities depending on the stay package.</dd>
          </div>
          <div>
            <dt className="font-sans text-base font-semibold text-ink mb-1">Is TS Residence suitable for digital nomads?</dt>
            <dd className="text-base text-neutral-700">Yes. TS Residence is suitable for digital nomads, remote workers, and long-stay professionals who want a central Seminyak location, flexible living, and access to lifestyle facilities.</dd>
          </div>
          <div>
            <dt className="font-sans text-base font-semibold text-ink mb-1">Where is TS Residence located?</dt>
            <dd className="text-base text-neutral-700">TS Residence is located in Seminyak, Bali, close to restaurants, shopping, wellness facilities, nightlife, and key lifestyle destinations.</dd>
          </div>
          <div>
            <dt className="font-sans text-base font-semibold text-ink mb-1">How do I book an apartment?</dt>
            <dd className="text-base text-neutral-700">You can book or inquire through the Book Apartment button, WhatsApp, email, or the <a href="/contact" className="text-gold underline hover:text-gold-dark">contact form</a> on the website.</dd>
          </div>
          <div>
            <dt className="font-sans text-base font-semibold text-ink mb-1">Do you offer flexible payment options?</dt>
            <dd className="text-base text-neutral-700">Yes. TS Residence offers flexible long-stay options, including Easy Pay and selected <a href="/offers" className="text-gold underline hover:text-gold-dark">promotional offers</a> depending on availability and current campaigns.</dd>
          </div>
          <div>
            <dt className="font-sans text-base font-semibold text-ink mb-1">Are there wellness or lifestyle benefits included?</dt>
            <dd className="text-base text-neutral-700">Yes. TS Residence guests may access selected TS Suites and No.1 Wellness Club benefits depending on the package, including lifestyle, wellness, and dining-related offers.</dd>
          </div>
          <div>
            <dt className="font-sans text-base font-semibold text-ink mb-1">Is TS Residence a hotel or apartment residence?</dt>
            <dd className="text-base text-neutral-700">TS Residence is a long-stay apartment residence connected to the TS Suites lifestyle ecosystem. It is designed for monthly living rather than short hotel stays.</dd>
          </div>
          <div>
            <dt className="font-sans text-base font-semibold text-ink mb-1">Why choose TS Residence over a normal villa or apartment in Bali?</dt>
            <dd className="text-base text-neutral-700">TS Residence combines the convenience of a serviced residence, a central Seminyak location, furnished apartments, flexible stay options, and access to lifestyle facilities in one integrated living experience.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
