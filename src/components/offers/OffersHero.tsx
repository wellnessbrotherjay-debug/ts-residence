"use client";

import Image from "next/image";

const OFFER_IMAGE =
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/e21d0685-e347-4234-84bf-5e5c84170a00/public";

export function OffersHero({ ctaHref }: { ctaHref: string }) {
  return (
    <section
      className="border-gold/30 relative h-[88vh] overflow-hidden border-y md:h-[90vh]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 md:fixed md:inset-x-0 md:top-0 md:h-screen">
          <Image
            src={OFFER_IMAGE}
            alt="TS Residence offers"
            fill
            priority
            sizes="100vw"
            quality={72}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/44" />
          <div className="absolute inset-0 bg-linear-to-b from-black/38 via-black/18 to-black/54" />
        </div>
      </div>

      <div className="relative z-10 flex h-full items-end px-6 pb-10 md:px-12 md:pb-14 lg:px-20 lg:pb-20 xl:px-28">
        <div className="max-w-5xl rounded-lg bg-black/45 p-6 text-white backdrop-blur-sm md:p-10 lg:p-12">
          <p className="text-gold-light text-[11px] font-semibold tracking-[0.24em] uppercase md:text-[12px]">
            Hero Offer
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[0.98] font-bold md:text-6xl lg:text-7xl xl:text-8xl">
            SPECIAL OFFER OPENING CELEBRATION
          </h1>
          <p className="mt-5 text-base leading-7 text-white/90 md:text-xl md:leading-9 lg:text-2xl lg:leading-10">
            Stay 3 months, pay 2 months on SOHO apartment category.
          </p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="border-gold bg-gold hover:bg-gold-dark mt-7 inline-flex min-h-12 items-center justify-center border px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition-all duration-400"
          >
            Explore This Offer
          </a>
        </div>
      </div>
    </section>
  );
}
