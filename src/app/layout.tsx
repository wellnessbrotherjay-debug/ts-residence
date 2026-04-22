import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlobalTextReveal } from "@/components/site/GlobalTextReveal";
import { Analytics } from "@/components/Analytics";
import { ConsentBanner } from "@/components/ConsentBanner";
import { DEFAULT_SEO, SITE_URL } from "@/lib/seo";
import { UrgencyEngine } from "@/components/UrgencyEngine";
import { ApartmentQuiz } from "@/components/ApartmentQuiz";
import "./globals.css";
import dynamic from "next/dynamic";
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });

const IMAGE_RECOVERY_SCRIPT = `
(() => {
  if (typeof window === "undefined") return;

  const proxyPath = "/api/image?url=";
  const fallback = "/ts-logo.svg";

  document.addEventListener(
    "error",
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;

      if (target.dataset.proxyRetry !== "1") {
        const original = target.currentSrc || target.src || "";
        if (original.startsWith("http")) {
          target.dataset.proxyRetry = "1";
          target.src = proxyPath + encodeURIComponent(original);
          return;
        }
      }

      if (target.dataset.fallbackApplied === "1") return;
      target.dataset.fallbackApplied = "1";
      target.src = fallback;
    },
    true,
  );
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/ts-logo.svg",
    shortcut: "/ts-logo.svg",
    apple: "/ts-logo.svg",
  },
  title: {
    default: DEFAULT_SEO.title,
    template: "%s | TS Residence",
  },
  description: DEFAULT_SEO.description,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "TS Residence",
    "Seminyak apartments",
    "Bali long stay apartment",
    "monthly apartment Bali",
    "serviced apartment Seminyak",
    "wellness living Bali",
  ],
  openGraph: {
    type: "website",
    siteName: DEFAULT_SEO.siteName,
    url: SITE_URL,
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    images: [
      {
        url: DEFAULT_SEO.ogImage,
        width: 1200,
        height: 630,
        alt: "TS Residence Seminyak",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    images: [DEFAULT_SEO.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col">
        <Suspense fallback={null}>
          <Analytics />
          <UrgencyEngine />
          <ApartmentQuiz />
          <ConsentBanner />
        </Suspense>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ApartmentComplex",
              name: "TS Residence",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              image: DEFAULT_SEO.ogImage,
              description: DEFAULT_SEO.description,
              telephone: "+6281119028111",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Jl. Nakula No.18",
                addressLocality: "Legian, Seminyak",
                addressRegion: "Bali",
                addressCountry: "ID",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -8.6974,
                longitude: 115.174,
              },
              sameAs: ["https://www.instagram.com/tsresidences/"],
              amenityFeature: [
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Coworking Space",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "No.1 Wellness Club",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Rooftop Pool",
                  value: true,
                },
              ],
            }),
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: IMAGE_RECOVERY_SCRIPT }} />
        <div className="bg-cream text-ink min-h-screen">
          <Navbar />
          <main className="flex-1 pt-18 xl:pt-28">
            <GlobalTextReveal />
            {children}
          </main>
          <Footer />
          <ChatWidget />
          <a
            href="https://wa.me/6281119028111"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed right-6 bottom-24 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-[11px] font-semibold tracking-[0.14em] text-[#0d2a1b] uppercase shadow-2xl transition-transform duration-300 hover:scale-110 md:right-8 md:bottom-28 md:h-14 md:w-14 md:text-sm"
            aria-label="WA chat on WhatsApp"
          >
            <span aria-hidden="true">WA</span>
          </a>
        </div>
      </body>
    </html>
  );
}
