import { notFound } from "next/navigation";
import { ApartmentDetailClient } from "@/components/apartments/ApartmentDetailClient";
import { apartmentDetailMap } from "@/lib/apartments-content";

type ApartmentSlug = keyof typeof apartmentDetailMap;

export function generateStaticParams() {
  return Object.keys(apartmentDetailMap).map((slug) => ({
    slug,
  }));
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
