"use client";

import Link from "next/link";
import {
  Instagram,
  Send,
  Phone,
  MapPin,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import type { Page } from "../types";

const LOGO_URL =
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/cce3ff72-a0c2-4b10-826e-c47befe5db00/public";

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
  return "/";
}

const stayLinks = [
  { label: "SOLO Apartment", page: "solo" as Page },
  { label: "STUDIO Apartment", page: "studio" as Page },
  { label: "SOHO Apartment", page: "soho" as Page },
];

const experienceLinks = [
  { label: "Five-Star Living", page: "five-star" as Page },
  { label: "Wellness Club", page: "healthy" as Page },
  { label: "Easy Living", page: "easy" as Page },
  { label: "Gallery", page: "gallery" as Page },
];

const quickLinks = [
  { label: "Home", page: "home" as Page },
  { label: "Apartments", page: "apartments" as Page },
  { label: "Offers", page: "offers" as Page },
  { label: "Contact", page: "contact" as Page },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/tsresidences/",
    icon: Instagram,
  },
  {
    label: "Telegram",
    href: "https://t.me/tsresidence",
    icon: Send,
  },
  {
    label: "Phone",
    href: "tel:+6281119028111",
    icon: Phone,
  },
];

function FooterNav({
  title,
  items,
}: {
  title: string;
  items: { label: string; page: Page }[];
}) {
  return (
    <div>
      <h3 className="text-gold-light mb-5 font-sans text-[11px] font-semibold tracking-[0.24em] uppercase">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={pageToPath(item.page)}
              className="group inline-flex max-w-full items-center gap-2 text-[0.95rem] text-white/72 transition-colors duration-300 hover:text-white"
            >
              <span className="wrap-break-word">{item.label}</span>
              <ArrowUpRight
                size={14}
                className="translate-y-px opacity-0 transition-all duration-300 group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Footer = () => {
  return (
    <footer className="border-gold/20 relative overflow-hidden border-t bg-[#14110f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-gold/12 absolute top-0 -right-32 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-gold/8 absolute -bottom-40 -left-20 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative px-6 py-10 md:px-10 md:py-14 lg:px-14 lg:py-20 xl:px-16 2xl:px-20">
        <div className="mx-auto w-full max-w-400">
          <div className="border-gold/20 grid gap-7 border-b pb-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:pb-12 lg:grid-cols-12 lg:gap-8 lg:pb-14">
            <div className="md:col-span-2 lg:col-span-4">
              <div className="max-w-md">
                <img
                  src={LOGO_URL}
                  alt="TS Residence"
                  className="h-14 w-auto sm:h-16"
                />
              </div>
            </div>

            <div className="lg:col-span-2 lg:pt-4">
              <FooterNav title="Stay" items={stayLinks} />
            </div>

            <div className="lg:col-span-2 lg:pt-4">
              <FooterNav title="Experience" items={experienceLinks} />
            </div>

            <div className="md:col-span-2 lg:col-span-4 lg:pt-4">
              <h3 className="text-gold-light mb-5 font-sans text-[11px] font-semibold tracking-[0.24em] uppercase">
                Contact
              </h3>

              <div className="space-y-4 text-[0.92rem] leading-7 text-white/74 sm:text-[0.95rem]">
                <a
                  href="https://www.google.com/maps/place/TS+Residence/@-8.697248,115.1704925,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd2399bec0bbbc5:0x47a0ebc4ff4fab5!8m2!3d-8.697248!4d115.1704925!16s%2Fg%2F11px8qwbk3?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 transition-colors duration-300 hover:text-white"
                >
                  <MapPin
                    size={16}
                    className="text-gold-light mt-1 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                  <span>
                    Jl. Nakula No.18, Legian, Seminyak,
                    <br />
                    Kec. Kuta, Kabupaten Badung, Bali 80361
                  </span>
                </a>

                <a
                  href="mailto:tsresidence@townsquare.co.id"
                  className="group flex items-start gap-3 break-all transition-colors duration-300 hover:text-white sm:items-center sm:break-normal"
                >
                  <Mail
                    size={16}
                    className="text-gold-light mt-1 shrink-0 sm:mt-0"
                  />
                  <span>tsresidence@townsquare.co.id</span>
                </a>

                <a
                  href="tel:+6281119028111"
                  className="group flex items-center gap-3 transition-colors duration-300 hover:text-white"
                >
                  <Phone size={16} className="text-gold-light shrink-0" />
                  <span>+62 811 1902 8111</span>
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      aria-label={item.label}
                      className="hover:border-gold/55 hover:bg-gold/12 flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/5 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-3 text-[10px] tracking-[0.16em] text-white/48 uppercase sm:gap-x-6">
              <span suppressHydrationWarning>&copy; {new Date().getFullYear()} TS Residence</span>
              {quickLinks.map((item) => (
                <Link
                  key={item.label}
                  href={pageToPath(item.page)}
                  className="transition-colors duration-300 hover:text-white/78"
                >
                  {item.label}
                </Link>
              ))}
              <span className="text-white/32">Privacy Policy</span>
              <span className="text-white/32">Terms</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
