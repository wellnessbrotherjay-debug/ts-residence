import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApartmentDetailClient } from "@/components/apartments/ApartmentDetailClient";
import { apartmentDetailMap } from "@/lib/apartments-content";

type ApartmentSlug = keyof typeof apartmentDetailMap;

export function generateStaticParams() {
  return Object.keys(apartmentDetailMap).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const apartmentSlug = slug as ApartmentSlug;
  const apartment = apartmentDetailMap[apartmentSlug];

  if (!apartment) {
    return {
      title: "Apartment Not Found",
      description: "The requested TS Residence apartment page could not be found.",
      alternates: {
        canonical: "/apartments",
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: apartment.name,
    description: apartment.description,
    alternates: {
      canonical: `/apartments/${apartmentSlug}`,
    },
    openGraph: {
      title: `${apartment.name} Apartment | TS Residence`,
      description: apartment.short,
      images: [
        {
          url: apartment.hero,
          alt: `${apartment.name} apartment at TS Residence`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${apartment.name} Apartment | TS Residence`,
      description: apartment.short,
      images: [apartment.hero],
    },
  };
}

export default async function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const apartmentSlug = slug as ApartmentSlug;

  if (!apartmentDetailMap[apartmentSlug]) {
    notFound();
  }

  return <ApartmentDetailClient slug={apartmentSlug} />;
}
