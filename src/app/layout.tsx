import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tsresidence.id"),
  title: {
    default: "TS Residence | Premium Long-Stay Apartments in Seminyak",
    template: "%s | TS Residence",
  },
  description:
    "Five-star long-stay apartments in Seminyak, Bali with wellness, hospitality, and flexible monthly living.",
  keywords: [
    "TS Residence",
    "Seminyak apartment",
    "Bali long stay",
    "monthly apartment Bali",
    "serviced apartment Seminyak",
    "wellness living Bali",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://tsresidence.id",
    siteName: "TS Residence",
    title: "TS Residence | Premium Long-Stay Apartments in Seminyak",
    description:
      "Five-star long-stay apartments in Seminyak, Bali with wellness, hospitality, and flexible monthly living.",
    images: [
      {
        url: "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp",
        width: 1200,
        height: 630,
        alt: "TS Residence Seminyak",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TS Residence | Premium Long-Stay Apartments in Seminyak",
    description:
      "Five-star long-stay apartments in Seminyak, Bali with wellness, hospitality, and flexible monthly living.",
    images: [
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp",
    ],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf8f5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col">
        <div className="bg-cream text-ink min-h-screen">
          <Navbar />
          <main id="content" className="flex-1 pt-22 lg:pt-24">
            {children}
          </main>
          <Footer />
          <a
            href="https://wa.me/6281119028111"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed right-8 bottom-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-sm font-semibold tracking-[0.14em] text-white uppercase shadow-2xl transition-transform duration-300 hover:scale-110"
            aria-label="Chat on WhatsApp"
          >
            WA
          </a>
        </div>
      </body>
    </html>
  );
}
