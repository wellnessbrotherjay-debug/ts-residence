import { notFound } from "next/navigation";
import { ApartmentDetailClient } from "@/components/apartments/ApartmentDetailClient";
import {
  apartmentDetailMap,
  type ApartmentKey,
} from "@/lib/apartments-content";

export function generateStaticParams() {
  return [{ slug: "solo" }, { slug: "studio" }, { slug: "soho" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!apartmentDetailMap[slug as ApartmentKey]) notFound();
  return <ApartmentDetailClient slug={slug as ApartmentKey} />;
}
