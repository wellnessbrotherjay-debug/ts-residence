import Link from "next/link";
import { BTN_SOLID } from "@/components/site/buttons";

const navItems = [
  { label: "Apartments", href: "/apartments" },
  { label: "Offers", href: "/offers" },
  { label: "Five-star Living", href: "/five-star-living" },
  { label: "Healthy Living", href: "/healthy-living" },
  { label: "Easy Living", href: "/easy-living" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  return (
    <header className="border-gold/35 bg-cream/90 fixed inset-x-0 top-0 z-60 border-b backdrop-blur">
      <div className="mx-auto max-w-400 px-4 lg:px-8">
        <div className="flex h-17 items-center justify-between lg:h-20">
          <Link href="/" className="flex flex-col items-center gap-0.5">
            <span className="font-serif text-3xl leading-none font-light tracking-tight lg:text-4xl">
              TS
            </span>
            <span className="text-ink/60 font-sans text-[8px] font-semibold tracking-[0.45em] uppercase">
              Residence
            </span>
          </Link>

          <nav
            className="no-scrollbar mx-3 flex items-center gap-5 overflow-x-auto lg:mx-0 lg:gap-8"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link text-ink/75 hover:text-ink shrink-0 text-[11px] lg:text-[15px]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            className={`${BTN_SOLID} shrink-0 px-4 py-2.5 lg:px-6`}
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
