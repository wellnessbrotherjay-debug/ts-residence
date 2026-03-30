import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BTN_DARK, BTN_GOLD } from "@/components/site/buttons";
import { apartmentDisplayList } from "@/lib/apartments-content";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover five-star long-stay apartments in Seminyak with integrated wellness and lifestyle access.",
  alternates: { canonical: "/" },
};

const heroImage =
  "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp";

export default function Page() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "TS Residence",
    url: "https://tsresidence.id",
    image: heroImage,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Nakula No.18, Legian, Seminyak",
      addressLocality: "Badung",
      addressRegion: "Bali",
      postalCode: "80361",
      addressCountry: "ID",
    },
    telephone: "+62 811 1902 8111",
  };

  return (
    <div className="bg-cream overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <section className="border-gold/30 relative min-h-[82vh] overflow-hidden border-y">
        <div className="absolute inset-0 bg-linear-to-br from-[#17110c] via-[#2d241a] to-[#513f2d]" />
        <div className="bg-gold/15 absolute -top-24 -right-20 h-80 w-80 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-360 items-center px-6 py-24 text-white md:px-10 lg:px-16">
          <div className="max-w-4xl">
            <p className="label-caps text-gold-light">TS Residence Seminyak</p>
            <h1 className="mt-5 font-serif text-5xl leading-[0.94] tracking-[-0.03em] sm:text-6xl lg:text-8xl">
              Five-star long-stay
              <br />
              apartments in Bali.
            </h1>
            <p className="mt-7 max-w-2xl text-[1.06rem] leading-8 text-white/90 md:text-[1.12rem]">
              Serviced monthly residences with wellness access, integrated
              lifestyle facilities, and concierge support in the heart of
              Seminyak.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/apartments" className={BTN_GOLD}>
                Explore Apartments
              </Link>
              <Link href="/contact" className={BTN_DARK}>
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-gold/25 border-b bg-white">
        <div className="mx-auto max-w-360 px-6 py-16 md:px-10 lg:px-16 lg:py-20">
          <div className="mb-12 max-w-3xl">
            <p className="label-caps text-gold">Apartment Collection</p>
            <h2 className="text-ink mt-4 font-serif text-4xl leading-tight md:text-5xl">
              Find the layout that fits your lifestyle.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {apartmentDisplayList.map((apt, index) => (
              <article
                key={apt.slug}
                className="border-gold/25 bg-cream overflow-hidden border"
              >
                <div className="relative aspect-4/5">
                  <Image
                    src={apt.image}
                    alt={`${apt.name} apartment`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    priority={index === 0}
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-ink font-serif text-4xl leading-none">
                    {apt.name}
                  </h3>
                  <p className="text-ink/60 mt-2 text-[11px] tracking-[0.2em] uppercase">
                    {apt.sqm} | {apt.bed}
                  </p>
                  <p className="text-ink/80 mt-4">{apt.short}</p>
                  <Link
                    href={`/apartments/${apt.slug}`}
                    className="text-gold-dark mt-6 inline-block text-[11px] font-semibold tracking-[0.22em] uppercase"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
