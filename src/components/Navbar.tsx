"use client";

import Link from "next/link";
import { Instagram, Send, Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BTN_SOLID } from "../constants";
import type { Page } from "../types";
import { apartmentDisplayList } from "@/lib/apartments-content";

const LOGO_URL =
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/cce3ff72-a0c2-4b10-826e-c47befe5db00/public";

function pathnameToPage(pathname: string): Page {
  if (pathname === "/") return "home";
  if (pathname === "/apartments") return "apartments";
  if (pathname === "/offers") return "offers";
  if (pathname === "/gallery") return "gallery";
  if (pathname === "/contact") return "contact";
  if (pathname === "/five-star" || pathname === "/five-star-living")
    return "five-star";
  if (pathname === "/healthy-living") return "healthy";
  if (pathname === "/easy-living") return "easy";
  if (pathname === "/apartments/solo") return "solo";
  if (pathname === "/apartments/studio") return "studio";
  if (pathname === "/apartments/soho") return "soho";
  return "home";
}

function pageToPath(page: Page): string {
  if (page === "home") return "/";
  if (page === "apartments") return "/apartments";
  if (page === "offers") return "/offers";
  if (page === "gallery") return "/gallery";
  if (page === "contact") return "/contact";
  if (page === "five-star") return "/five-star-living";
  if (page === "healthy") return "/healthy-living";
  if (page === "easy") return "/easy-living";
  if (page === "solo") return "/apartments/solo";
  if (page === "studio") return "/apartments/studio";
  if (page === "soho") return "/apartments/soho";
  if (page === "admin") return "/";
  return "/";
}

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = pathnameToPage(pathname);

  const setPage = (page: Page) => {
    router.push(pageToPath(page));
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isApartmentsOpen, setIsApartmentsOpen] = useState(false);
  const [showTopLogo, setShowTopLogo] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 40);
      setShowTopLogo(currentY > 24);
    };

    const initFrame = requestAnimationFrame(() => {
      handleScroll();
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      cancelAnimationFrame(initFrame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setIsApartmentsOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const allNav: { label: string; value: Page }[] = [
    { label: "Offers", value: "offers" },
    { label: "Five-star living", value: "five-star" },
    { label: "Healthy living", value: "healthy" },
    { label: "Easy living", value: "easy" },
    { label: "Gallery", value: "gallery" },
    { label: "Contact", value: "contact" },
  ];

  const handleNavClick = (page: Page) => setPage(page);
  const isApartmentPage =
    currentPage === "apartments" ||
    currentPage === "solo" ||
    currentPage === "studio" ||
    currentPage === "soho";

  return (
    <>
      <motion.nav
        data-no-global-reveal="true"
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`border-gold/35 fixed top-0 left-0 z-60 w-full border-b transition-all duration-700 ${
          isScrolled
            ? "bg-white/72 shadow-[0_6px_28px_rgba(0,0,0,0.06)] backdrop-blur-2xl"
            : "bg-cream"
        }`}
      >
        <div className="w-full px-4">
          {/* Mobile Header */}
          <div className="flex h-18 items-center justify-between xl:hidden">
            <div className="w-10" />
            <button
              onClick={() => setPage("home")}
              className="group flex flex-col items-center gap-0.5"
              aria-label="TS Residence home"
            >
              <img
                src={LOGO_URL}
                alt="TS Residence"
                className="h-10 w-auto transition-opacity duration-500 group-hover:opacity-85"
              />
            </button>
            <button
              className="text-ink p-2 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden xl:block">
            <motion.div
              animate={{
                opacity: 1,
                height: showTopLogo ? 0 : 64,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`border-gold/35 flex items-center overflow-hidden border-b transition-[padding,justify-content] duration-500 ${"justify-center px-6"}`}
            >
              <motion.button
                onClick={() => setPage("home")}
                animate={{
                  scale: 1,
                  opacity: showTopLogo ? 0 : 1,
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-center transition-all duration-500"
                aria-label="TS Residence home"
              >
                <img
                  src={LOGO_URL}
                  alt="TS Residence"
                  className="h-14 w-auto"
                />
              </motion.button>
            </motion.div>

            <div
              className={`relative flex items-center justify-between transition-[height,padding] duration-500 xl:px-6 ${showTopLogo ? "h-12" : "h-16"}`}
            >
              <div className="flex flex-1 items-center">
                <motion.button
                  onClick={() => setPage("home")}
                  initial={false}
                  animate={{
                    opacity: showTopLogo ? 1 : 0,
                    x: showTopLogo ? 0 : -12,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ pointerEvents: showTopLogo ? "auto" : "none" }}
                  aria-label="TS Residence home"
                >
                  <img src={LOGO_URL} alt="TS Residence" className="h-9 w-auto" />
                </motion.button>
              </div>
 
              <div
                className={`flex flex-auto items-center justify-center transition-all duration-500 ${showTopLogo ? "gap-6 pt-0" : "gap-8"}`}
              >
                <div
                  className="relative"
                  onMouseEnter={() => setIsApartmentsOpen(true)}
                  onMouseLeave={() => setIsApartmentsOpen(false)}
                >
                  <div
                    className={`nav-link text-ink/70 hover:text-ink flex items-center gap-2 ${isApartmentPage ? "text-ink font-medium" : ""}`}
                  >
                    <Link
                      href="/apartments"
                      onClick={() => setIsApartmentsOpen(false)}
                      className="focus:outline-hidden"
                    >
                      <span className="xl:text-sm">Apartments</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsApartmentsOpen((prev) => !prev)}
                      onBlur={(event) => {
                        if (
                          !event.currentTarget.parentElement?.parentElement?.contains(
                            event.relatedTarget as Node | null,
                          )
                        ) {
                          setIsApartmentsOpen(false);
                        }
                      }}
                      aria-expanded={isApartmentsOpen}
                      aria-haspopup="menu"
                      aria-label="Toggle apartments menu"
                      className="flex items-center"
                    >
                      <span
                        className={`text-[10px] transition-transform duration-300 ${isApartmentsOpen ? "translate-y-px rotate-180" : ""}`}
                      >
                        ▾
                      </span>
                    </button>
                  </div>
 
                  <AnimatePresence>
                    {isApartmentsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="absolute top-full left-1/2 z-80 mt-4 w-3xl -translate-x-1/2 border border-[#d9ccb7] bg-[#fbf8f2] p-4 shadow-[0_20px_60px_rgba(28,25,23,0.12)]"
                      >
                        <div className="mb-4 flex items-center justify-between border-b border-[#e8dfd3] pb-3">
                          <p className="font-serif text-[1.55rem] leading-none text-[#2d241a]">
                            Apartment Collection
                          </p>
                          <Link
                            href="/apartments"
                            className="text-[11px] font-semibold tracking-[0.22em] text-[#7f6747] uppercase transition-colors hover:text-[#2d241a]"
                            onClick={() => setIsApartmentsOpen(false)}
                          >
                            View all
                          </Link>
                        </div>
 
                        <div className="space-y-3">
                          {apartmentDisplayList.map((apartment) => (
                            <Link
                              key={apartment.slug}
                              href={`/apartments/${apartment.slug}`}
                              className="group grid grid-cols-[120px_1fr] gap-4 border border-transparent p-2 transition-all duration-300 hover:border-[#e4d7c2] hover:bg-white"
                              onClick={() => setIsApartmentsOpen(false)}
                            >
                              <div className="overflow-hidden bg-[#f1eadf]">
                                <img
                                  src={apartment.image}
                                  alt={apartment.name}
                                  className="h-20 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                />
                              </div>
                              <div className="flex min-w-0 flex-col justify-center">
                                <p className="font-serif text-[1.1rem] leading-6 text-[#2d241a]">
                                  {apartment.name} — {apartment.sqm},{" "}
                                  {apartment.bed}
                                </p>
                                <p className="mt-1 line-clamp-2 text-[0.96rem] leading-7 text-[#5e5244]">
                                  {apartment.short}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
 
                {allNav.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.value)}
                    className={`nav-link text-ink/70 hover:text-ink xl:text-sm ${currentPage === item.value ? "text-ink font-medium" : ""}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
 
              <div className="flex flex-1 justify-end">
                <button
                  onClick={() => setPage("contact")}
                  className="bg-[#8b7658] px-6 py-2.5 font-sans text-xs font-semibold tracking-[0.2em] text-white uppercase transition-all duration-300 hover:bg-[#755f44] xl:px-8 xl:py-3 xl:text-sm"
                >
                  Book now
                </button>
              </div>
            </div>div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-cream fixed inset-0 z-100 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <button
                onClick={() => setPage("home")}
                className="flex items-center"
                aria-label="TS Residence home"
              >
                <img
                  src={LOGO_URL}
                  alt="TS Residence"
                  className="h-10 w-auto"
                />
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-ink p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-1 overflow-y-auto px-6 py-4">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                onClick={() => {
                  setPage("apartments");
                  setIsMenuOpen(false);
                }}
                className="text-ink hover:text-gold py-3 font-serif text-3xl font-light transition-colors md:text-4xl"
              >
                Apartments
              </motion.button>
              {allNav.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i + 1) * 0.08, duration: 0.5 }}
                  onClick={() => {
                    handleNavClick(item.value);
                    setIsMenuOpen(false);
                  }}
                  className="text-ink hover:text-gold py-3 font-serif text-3xl font-light transition-colors md:text-4xl"
                >
                  {item.label}
                </motion.button>
              ))}

              <div className="mt-4 grid w-full max-w-xs grid-cols-1 gap-2 border-t border-[#e2d7c7] pt-5">
                {apartmentDisplayList.map((apartment, index) => (
                  <motion.button
                    key={apartment.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.06, duration: 0.45 }}
                    onClick={() => {
                      router.push(`/apartments/${apartment.slug}`);
                      setIsMenuOpen(false);
                    }}
                    className="border-gold/25 bg-white px-4 py-3 text-left transition-colors hover:bg-[#f7f1e7]"
                  >
                    <p className="text-ink font-serif text-xl leading-none">
                      {apartment.name}
                    </p>
                    <p className="text-ink/60 mt-2 text-[11px] tracking-[0.18em] uppercase">
                      {apartment.sqm} | {apartment.bed}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 px-6 pb-8">
              <button
                onClick={() => {
                  setPage("contact");
                  setIsMenuOpen(false);
                }}
                className={`${BTN_SOLID} w-full max-w-xs text-center`}
              >
                Book Apartment
              </button>
              <div className="flex gap-6">
                <a
                  href="https://www.instagram.com/tsresidences/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-gold transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="text-muted hover:text-gold transition-colors"
                >
                  <Send size={20} />
                </a>
                <a
                  href="#"
                  className="text-muted hover:text-gold transition-colors"
                >
                  <Phone size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
