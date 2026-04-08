import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlobalTextReveal } from "@/components/site/GlobalTextReveal";
import { Analytics } from "@/components/Analytics";
import { DEFAULT_SEO, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
        <Analytics />
        <div className="bg-cream text-ink min-h-screen">
          <Navbar />
          <main className="flex-1 pt-18 lg:pt-28">
            <GlobalTextReveal />
            {children}
          </main>
          <Footer />
          <a
            href="https://wa.me/6281119028111"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed right-4 bottom-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-[11px] font-semibold tracking-[0.14em] text-[#0d2a1b] uppercase shadow-2xl transition-transform duration-300 hover:scale-110 md:right-8 md:bottom-8 md:h-14 md:w-14 md:text-sm"
            aria-label="WA chat on WhatsApp"
          >
            <span aria-hidden="true">WA</span>
          </a>
        </div>
      </body>
    </html>
  );
}
