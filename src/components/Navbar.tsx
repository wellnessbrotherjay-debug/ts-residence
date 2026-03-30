"use client";

import { Instagram, Send, Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BTN_SOLID } from "../constants";
import type { Page } from "../types";

function pathnameToPage(pathname: string): Page {
  if (pathname === "/") return "home";
  if (pathname === "/apartments") return "apartments";
  if (pathname === "/offers") return "offers";
  if (pathname === "/gallery") return "gallery";
  if (pathname === "/contact") return "contact";
  if (pathname === "/five-star") return "five-star";
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
  if (page === "five-star") return "/five-star";
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
  const [showTopLogo, setShowTopLogo] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 40);

      if (currentY < 20) {
        setShowTopLogo(true);
      } else if (currentY > lastScrollY.current + 2) {
        setShowTopLogo(false);
      } else if (currentY < lastScrollY.current - 2) {
        setShowTopLogo(true);
      }

      lastScrollY.current = currentY;
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
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const leftNav: { label: string; value: Page }[] = [
    { label: "Apartments", value: "apartments" },
    { label: "Offers", value: "offers" },
    { label: "Gallery", value: "gallery" },
  ];

  const rightNav: { label: string; value: Page }[] = [
    { label: "Five-Star", value: "five-star" },
    { label: "Wellness", value: "healthy" },
    { label: "Contact", value: "contact" },
  ];

  const allNav = [
    ...leftNav,
    ...rightNav,
    { label: "Easy Living", value: "easy" as Page },
  ];

  const handleNavClick = (page: Page) => setPage(page);

  return (
    <>
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 w-full z-60 border-b border-gold/35 transition-all duration-700 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
            : "bg-cream"
        }`}
      >
        <div className="w-full px-4">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between">
            <div className="w-10" />
            <button
              onClick={() => setPage("home")}
              className="flex flex-col items-center gap-0.5 group"
            >
              <div className="flex items-baseline gap-0">
                <span className="text-3xl font-serif font-light tracking-tight transition-colors duration-500 text-ink">
                  T
                </span>
                <span className="text-3xl font-serif font-light tracking-tight transition-colors duration-500 text-ink">
                  S
                </span>
              </div>
              <span className="text-[8px] tracking-[0.45em] uppercase font-sans font-semibold transition-colors duration-500 text-ink/50">
                Residence
              </span>
            </button>
            <button
              className="p-2 transition-colors text-ink"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <motion.div
              animate={{
                opacity: showTopLogo ? 1 : 0,
                y: showTopLogo ? 0 : -10,
                height: showTopLogo ? 64 : 0,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex justify-center items-center overflow-hidden border-b border-gold/35"
              style={{ pointerEvents: showTopLogo ? "auto" : "none" }}
            >
              <button
                onClick={() => setPage("home")}
                className="justify-self-center flex flex-col items-center gap-1 text-ink"
              >
                <div className="flex items-baseline gap-0">
                  <span className="text-4xl font-serif font-light leading-none tracking-tight text-ink">
                    T
                  </span>
                  <span className="text-4xl font-serif font-light leading-none tracking-tight text-ink">
                    S
                  </span>
                </div>
                <span className="text-[8px] tracking-[0.45em] uppercase font-sans font-semibold text-ink/55">
                  Residence
                </span>
              </button>
            </motion.div>

            <div className="relative flex h-16 items-center justify-center">
              <div className="flex items-center gap-10">
                {allNav.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.value)}
                    className={`nav-link text-ink/70 hover:text-ink ${currentPage === item.value ? "font-medium text-ink" : ""}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage("contact")}
                className="absolute right-0  bg-[#8b7658] px-10 py-3 text-[14px] font-sans font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#755f44]"
              >
                Book
              </button>
            </div>
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
            className="fixed inset-0 z-[100] bg-cream flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <button
                onClick={() => setPage("home")}
                className="flex flex-col items-center gap-0.5"
              >
                <div className="flex items-baseline">
                  <span className="text-3xl font-serif font-light text-ink">
                    T
                  </span>
                  <span className="text-3xl font-serif font-light text-ink">
                    S
                  </span>
                </div>
                <span className="text-[8px] tracking-[0.45em] uppercase font-sans font-semibold text-ink/60">
                  Residence
                </span>
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-ink"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-1">
              {allNav.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onClick={() => {
                    handleNavClick(item.value);
                    setIsMenuOpen(false);
                  }}
                  className="text-3xl md:text-4xl font-serif font-light text-ink hover:text-gold transition-colors py-3"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            <div className="px-6 pb-10 flex flex-col items-center gap-6">
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
