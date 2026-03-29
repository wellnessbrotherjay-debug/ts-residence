"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navGroups } from "@/lib/site-data";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const mobileNav = [
    ...navGroups.left,
    ...navGroups.right,
    { label: "Easy Living", href: "/easy-living" },
  ];

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-white/95 py-3 shadow-[0_1px_0_rgba(0,0,0,0.05)] backdrop-blur-xl"
            : "bg-cream py-5 lg:py-6"
        }`}
      >
        <div className="section-shell flex items-center justify-between">
          <div className="hidden flex-1 items-center gap-8 lg:flex">
            {navGroups.left.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={isActive(pathname, item.href)}
                className="nav-link"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link href="/" className="flex flex-col items-center gap-0.5">
            <div className="flex items-baseline">
              <span className="text-3xl font-light tracking-tight text-ink lg:text-4xl">
                T
              </span>
              <span className="text-3xl font-light tracking-tight text-ink lg:text-4xl">
                S
              </span>
            </div>
            <span className="text-[8px] font-semibold uppercase tracking-[0.45em] text-ink/50">
              Residence
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-8 lg:flex">
            {navGroups.right.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={isActive(pathname, item.href)}
                className="nav-link"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-4 border border-ink/20 px-7 py-2.5 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-all duration-500 hover:bg-ink hover:text-white"
            >
              Book
            </Link>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center lg:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            <div className="flex w-5 flex-col gap-1.5">
              <span
                className={`h-px bg-ink transition ${
                  isMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px bg-ink transition ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-px bg-ink transition ${
                  isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-cream pt-28">
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            {mobileNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-3xl font-light text-ink transition-colors hover:text-gold md:text-4xl"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="px-6 pb-10 text-center">
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex w-full max-w-xs items-center justify-center bg-gold px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white"
            >
              Book Apartment
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
