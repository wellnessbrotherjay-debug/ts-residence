import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";
import { BTN_DARK, BTN_GOLD } from "@/components/site/buttons";
import { apartmentDisplayList } from "@/lib/apartments-content";

export const metadata: Metadata = {
  title: "Apartments",
  description:
    "Browse SOLO, STUDIO, and SOHO apartment options at TS Residence in Seminyak.",
  alternates: { canonical: "/apartments" },
};

export default function Page() {
  return (
    <div className="bg-cream overflow-x-hidden">
      <section className="border-gold/30 relative min-h-[72vh] overflow-hidden border-y md:min-h-[86vh]">
        <Image
          src="https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-building-front-left.webp"
          alt="TS Residence Apartments"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/52 via-black/34 to-black/66" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_82%_80%,rgba(196,160,96,0.2),transparent_52%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-black/62 to-transparent" />

        <div className="relative flex min-h-[72vh] w-full items-center justify-center px-6 py-18 text-center md:min-h-[86vh] md:px-12 md:py-22 lg:px-20 lg:py-24 xl:px-28">
          <FadeInView className="w-full max-w-300 text-white">
            <div className="border-gold/45 inline-flex items-center gap-3 border bg-black/58 px-5 py-2.5">
              <span className="text-gold-light text-[11px] font-semibold tracking-[0.24em] uppercase">
                Apartments
              </span>
              <span className="relative flex h-2 w-2">
                <span className="bg-gold-light absolute inline-flex h-full w-full animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full opacity-75" />
                <span className="bg-gold-light relative inline-flex h-2 w-2 rounded-full" />
              </span>
              <span className="text-[11px] font-medium tracking-[0.2em] text-white/95 uppercase">
                SOLO | STUDIO | SOHO
              </span>
            </div>

            <h1 className="mx-auto mt-8 max-w-[14ch] font-serif text-[3.25rem] leading-[0.9] tracking-[-0.03em] text-white sm:text-7xl md:text-[5.8rem] lg:text-[6.9rem]">
              Find the apartment
              <br />
              that matches
              <br />
              your rhythm.
            </h1>

            <p className="mx-auto mt-9 max-w-190 text-[1.08rem] leading-8 text-white/92 [text-shadow:0_2px_18px_rgba(0,0,0,0.38)] md:text-[1.16rem] md:leading-9">
              Premium monthly residences designed with five-star comfort,
              practical layouts, and service-led convenience in Seminyak.
            </p>

            <div className="via-gold/55 mx-auto mt-9 h-px w-full max-w-115 bg-linear-to-r from-transparent to-transparent" />
          </FadeInView>
        </div>
      </section>

      <section className="border-gold/30 border-b bg-white">
        <div className="mx-auto w-full max-w-440 px-6 py-16 md:px-10 md:py-18 lg:px-12 lg:py-22 xl:px-14">
          <FadeInView className="mb-12 max-w-260">
            <p className="label-caps text-gold">Apartment Collection</p>
            <h2 className="text-ink mt-4 font-serif text-[2.3rem] leading-[1.03] md:text-[3.2rem]">
              Three apartment typologies,
              <br />
              one premium long-stay standard.
            </h2>
          </FadeInView>

          <StaggerContainer
            className="space-y-7 md:space-y-8"
            staggerDelay={0.14}
          >
            {apartmentDisplayList.map((apartment, index) => (
              <StaggerItem
                key={apartment.slug}
                className="group border-gold/25 bg-cream overflow-hidden border"
              >
                <Link
                  href={`/apartments/${apartment.slug}`}
                  className="grid h-full w-full cursor-pointer grid-cols-1 lg:grid-cols-2"
                >
                  <div
                    className={`relative overflow-hidden ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <Image
                      src={apartment.image}
                      alt={apartment.name}
                      width={1200}
                      height={900}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="h-90 w-full object-cover transition-transform duration-1800 ease-out group-hover:scale-[1.06] md:h-107.5 lg:h-130"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute right-5 bottom-5 border border-white/35 bg-black/28 px-3 py-2 text-[10px] tracking-[0.2em] text-white/90 uppercase backdrop-blur-sm md:right-7 md:bottom-7">
                      {apartment.sqm}
                    </div>
                  </div>

                  <div
                    className={`flex items-center px-6 py-10 md:px-9 md:py-12 lg:px-12 lg:py-14 ${index % 2 === 1 ? "lg:order-1" : ""}`}
                  >
                    <div className="max-w-lg">
                      <p className="label-caps text-gold-dark">
                        Apartment Type
                      </p>
                      <h3 className="text-ink mt-4 font-serif text-[2.9rem] leading-[0.92] md:text-[3.6rem]">
                        {apartment.name}
                      </h3>
                      <p className="text-ink/60 mt-3 text-[12px] tracking-[0.2em] uppercase">
                        {apartment.bed}
                      </p>
                      <p className="text-ink/80 mt-6 text-[1.08rem] leading-8">
                        {apartment.short}
                      </p>
                      <p className="text-ink/65 mt-4 text-[0.98rem] leading-7">
                        {apartment.audience}
                      </p>
                      <div className="border-gold/25 mt-7 border-t pt-6">
                        <span className="text-gold-dark group-hover:text-ink text-[11px] font-semibold tracking-[0.22em] uppercase transition-all duration-500 group-hover:tracking-[0.26em]">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-gold/30 bg-cream border-b">
        <div className="w-full px-6 py-14 text-center md:px-10 md:py-16 lg:px-12 lg:py-20 xl:px-14">
          <FadeInView className="mx-auto max-w-245">
            <p className="label-caps text-gold">Need Recommendation?</p>
            <h3 className="text-ink mt-4 font-serif text-[2.2rem] leading-[1.03] md:text-[3rem]">
              Let our team suggest the most suitable apartment
              <br />
              for your duration and lifestyle.
            </h3>
            <div className="mt-10 flex flex-wrap justify-center gap-4 md:gap-5">
              <Link href="/contact" className={BTN_GOLD}>
                Contact Concierge
              </Link>
              <Link href="/offers" className={BTN_DARK}>
                View Offers
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
