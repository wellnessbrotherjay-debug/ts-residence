import type { Metadata } from "next";
import { HomeClient } from "@/app/home-client";
import { DEFAULT_SEO, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Premium long-stay apartments in Seminyak with five-star living, wellness experiences, and easy monthly stay options.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TS Residence | Home",
    description:
      "Premium long-stay apartments in Seminyak with five-star living, wellness experiences, and easy monthly stay options.",
    url: SITE_URL,
    images: [
      {
        url: DEFAULT_SEO.ogImage,
        width: 1200,
        height: 630,
        alt: "TS Residence Seminyak",
      },
    ],
  },
};

export default function Page() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: DEFAULT_SEO.siteName,
    url: SITE_URL,
    image: DEFAULT_SEO.ogImage,
    telephone: "+62 811 1902 8111",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Nakula No.18, Legian, Seminyak",
      addressLocality: "Badung",
      addressRegion: "Bali",
      postalCode: "80361",
      addressCountry: "ID",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomeClient />
    </>
  );
}
