import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlobalTextReveal } from "@/components/site/GlobalTextReveal";
import { Analytics } from "@/components/Analytics";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { ConsentBanner } from "@/components/ConsentBanner";
import { DEFAULT_SEO, SITE_URL } from "@/lib/seo";
import { UrgencyEngine } from "@/components/UrgencyEngine";
import { ApartmentQuiz } from "@/components/ApartmentQuiz";
import "./globals.css";

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
          <PerformanceMonitor />
          <ServiceWorkerRegistration />
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
        <div className="bg-cream text-ink min-h-screen">
          <Navbar />
          <main className="flex-1 pt-12.5 xl:pt-28">
            <GlobalTextReveal />
            {children}
          </main>
          <Footer />
          <div className="fixed right-6 bottom-24 z-40 flex flex-col gap-3 md:right-8 md:bottom-28 md:gap-4">
            <a
              href="https://t.me/tsresidence"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0088cc] text-white shadow-2xl transition-transform duration-300 hover:scale-110 md:h-14 md:w-14"
              aria-label="Telegram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/6281119028111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-[11px] font-semibold tracking-[0.14em] text-[#0d2a1b] uppercase shadow-2xl transition-transform duration-300 hover:scale-110 md:h-14 md:w-14 md:text-sm"
              aria-label="WhatsApp"
            >
              <span aria-hidden="true">WA</span>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
