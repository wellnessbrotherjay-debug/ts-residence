import Image from "next/image";
import { OffersHero } from "@/components/offers/OffersHero";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";
import { offers } from "@/lib/site-data";
import Link from "next/link";

export default function Page() {
  const featured = offers[0];
  const listing = offers.slice(1);

  return (
    <div className="relative isolate overflow-x-hidden">
      <OffersHero />

      <section className="border-gold/30 relative z-10 border-b bg-white py-16 md:py-24">
        <div className="section-shell px-6 md:px-12 lg:px-20 xl:px-28">
          <div className="group grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-12">
            <FadeInView direction="right" className="overflow-hidden">
              <div className="relative h-full overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.05]"
                  quality={80}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
                <div className="absolute bottom-6 left-6 right-6 pt-20 md:bottom-12 md:left-12 lg:bottom-16 lg:left-16 md:pt-0">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 md:p-6">
                    <p className="text-gold-light mb-3 text-[10px] font-semibold tracking-[0.24em] uppercase md:text-[11px]">
                      Featured Offer 01
                    </p>
                    <h2 className="text-white font-serif text-[2.1rem] font-bold leading-[1.02] md:text-[3.4rem] lg:text-[4.2rem]">
                      {featured.title}
                    </h2>
                  </div>
                </div>
              </div>
            </FadeInView>

            <FadeInView
              direction="left"
              className="card-surface flex h-full flex-col justify-between px-6 py-10 md:p-12 lg:p-16"
            >
              <div data-no-text-reveal="true" className="max-w-2xl">
                <StaggerContainer amount={0.2} staggerDelay={0.12}>
                  <StaggerItem>
                    <p className="text-ink/86 font-serif text-[1.125rem] leading-9 font-light italic md:text-[1.6rem] lg:text-[2rem]">
                      {featured.description}
                    </p>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="bg-gold/30 mt-8 h-px w-16 md:mt-10 md:w-20" />
                  </StaggerItem>
                  <StaggerItem>
                    <Link
                      href={featured.link || "/apartments"}
                      className="border-gold bg-gold hover:bg-gold-dark mt-6 inline-flex min-h-12 items-center justify-center border px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition-all duration-400"
                    >
                      Explore This Offer
                    </Link>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      <section className="border-gold/30 bg-cream/96 relative z-10 mt-10 border-b py-16 md:mt-14 md:py-24 lg:mt-18">
        <div className="section-shell px-6 md:px-12 lg:px-20 xl:px-28">
          <FadeInView className="section-header text-center">
            <p className="label-caps text-gold">More Offers</p>
            <h2 className="text-ink font-serif text-3xl leading-tight md:text-5xl">
              Flexible long-stay options,
              <br />
              clearly presented.
            </h2>
          </FadeInView>

          <StaggerContainer
            className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
            staggerDelay={0.14}
          >
            {listing.map((offer, idx) => (
              <StaggerItem
                key={offer.title}
                className="card-surface group overflow-hidden"
              >
                <Link href={offer.link || "/apartments"} className="h-full block">
                  <article className="h-full">
                    <div className="overflow-hidden">
                      <Image
                        src={offer.image}
                        alt={offer.title}
                        fill
                        className="object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.06]"
                        quality={70}
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      />
                    </div>
                    <div className="flex min-h-72 flex-col p-7 md:p-8">
                      <div className="bg-cream/90 backdrop-blur-sm rounded-lg p-3 md:p-4 mb-4">
                        <p className="text-gold-dark text-[11px] font-semibold tracking-[0.24em] uppercase">
                          {String(idx + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <h3 className="text-ink mt-4 font-serif text-[2rem] leading-[1.02]">
                        {offer.title}
                      </h3>
                      <p className="text-ink/76 mt-5 text-[1rem] leading-8">
                        {offer.description}
                      </p>
                    </div>
                  </article>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-gold/30 relative z-10 mt-10 border-b bg-white/96 py-16 md:mt-14 md:py-24 lg:mt-18">
        <div className="section-shell px-6 md:px-12 lg:px-20 xl:px-28">
          <FadeInView className="mx-auto max-w-4xl text-center">
            <p className="label-caps text-gold">Find Out More</p>
            <h2 className="text-ink mt-4 font-serif text-3xl leading-tight md:text-5xl">
              Speak to us on WhatsApp
              <br />
              to find the right offer.
            </h2>
            <p className="text-ink/76 mx-auto mt-6 max-w-3xl text-[1rem] leading-8">
              We&apos;ll help you understand availability, apartment options,
              stay terms, and which offer fits your plan best.
            </p>
            <a
              href="https://wa.me/6281119028111"
              target="_blank"
              rel="noopener noreferrer"
              className="border-gold bg-gold hover:bg-gold-dark mt-8 inline-flex min-h-12 items-center justify-center border px-7 py-3.5 text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition-all duration-400 md:min-h-13.5 md:px-9 md:py-4 md:text-[12px] md:tracking-[0.22em]"
            >
              Speak On WhatsApp
            </a>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
