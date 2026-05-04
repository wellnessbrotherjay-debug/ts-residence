import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApartmentDetailClient } from "@/components/apartments/ApartmentDetailClient";
import {
  apartmentDetailMap,
  type ApartmentKey,
} from "@/lib/apartments-content";

export function generateStaticParams() {
  return [{ slug: "solo" }, { slug: "studio" }, { slug: "soho" }];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const apartment = apartmentDetailMap[slug as ApartmentKey];

  if (!apartment) {
    return {
      title: "Apartment Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${apartment.name} Apartment`,
    description: apartment.description,
    alternates: {
      canonical: `/apartments/${slug}`,
    },
    openGraph: {
      title: `${apartment.name} Apartment | TS Residence`,
      description: apartment.short,
      images: [
        {
          url: apartment.hero,
          alt: `${apartment.name} apartment`,
        },
      ],
    },
  };
}

export default function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  if (!apartmentDetailMap[slug as ApartmentKey]) notFound();
  return <ApartmentDetailClient slug={slug as ApartmentKey} />;
}
