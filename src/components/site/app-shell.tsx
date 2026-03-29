import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Navbar } from "./navbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
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
  );
}
