import type { Metadata } from "next";
import { Playfair_Display, Raleway } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const sans = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const serif = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TS Residence",
  description:
    "Five-star long-stay apartments in Seminyak, Bali with wellness, hospitality, and flexible living.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div className="min-h-screen bg-cream text-ink">
          <Navbar />
          <main className="flex-1 pt-24 lg:pt-28">{children}</main>
          <Footer />
          <a
            href="https://wa.me/6281119028111"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed right-8 bottom-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-2xl transition-transform duration-300 hover:scale-110"
            aria-label="Chat on WhatsApp"
          >
            WA
          </a>
        </div>
      </body>
    </html>
  );
}
