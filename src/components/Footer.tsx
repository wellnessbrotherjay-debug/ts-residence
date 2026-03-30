import Link from "next/link";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-gold/25 relative overflow-hidden border-t bg-[#14110f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-gold/10 absolute -top-24 -right-16 h-72 w-72 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Main Footer */}
      <div className="relative mx-auto max-w-350 px-6 pt-20 pb-16 md:px-10 lg:pt-24 lg:pb-18">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="space-y-8 lg:col-span-4">
            <div className="flex flex-col items-start gap-0.5">
              <div className="flex items-baseline">
                <span className="font-serif text-4xl font-light text-white">
                  T
                </span>
                <span className="font-serif text-4xl font-light text-white">
                  S
                </span>
              </div>
              <span className="font-sans text-[8px] font-semibold tracking-[0.45em] text-white/65 uppercase">
                Residence
              </span>
            </div>
            <p className="max-w-sm text-[0.95rem] leading-7 text-white/75">
              A new living concept combining five-star luxury, wellness, and
              convenience in the heart of Seminyak, Bali.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/tsresidences/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:border-gold/65 hover:bg-gold/15 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white/80 transition-all duration-500 hover:-translate-y-0.5 hover:text-white"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://wa.me/6281119028111"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:border-gold/65 hover:bg-gold/15 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white/80 transition-all duration-500 hover:-translate-y-0.5 hover:text-white"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Stay */}
          <div className="lg:col-span-2">
            <h4 className="text-gold-light mb-6 font-sans text-[11px] font-semibold tracking-[0.22em] uppercase">
              Stay
            </h4>
            <ul className="space-y-3">
              {[
                { label: "SOLO Apartment", href: "/apartments/solo" },
                { label: "STUDIO Apartment", href: "/apartments/studio" },
                { label: "SOHO Apartment", href: "/apartments/soho" },
                { label: "Special Offers", href: "/offers" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/75 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience */}
          <div className="lg:col-span-2">
            <h4 className="text-gold-light mb-6 font-sans text-[11px] font-semibold tracking-[0.22em] uppercase">
              Experience
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Five-Star Living", href: "/five-star-living" },
                { label: "Wellness Club", href: "/healthy-living" },
                { label: "Easy Living", href: "/easy-living" },
                { label: "Gallery", href: "/gallery" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/75 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="text-gold-light mb-6 font-sans text-[11px] font-semibold tracking-[0.22em] uppercase">
              Contact
            </h4>
            <div className="space-y-4 text-sm leading-7 text-white/78">
              <p className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-light mt-0.5 shrink-0" />
                <span>
                  Jl. Nakula No.18, Legian, Seminyak,
                  <br />
                  Kec. Kuta, Kabupaten Badung, Bali 80361
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Mail size={16} className="text-gold-light shrink-0" />
                <span>tsresidence@townsquare.co.id</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone size={16} className="text-gold-light shrink-0" />
                <span>+62 811 1902 8111</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/12">
        <div className="mx-auto flex max-w-350 flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row md:px-10">
          <div className="flex flex-wrap justify-center gap-6 text-[10px] tracking-[0.15em] text-white/55 uppercase">
            <span>&copy; {new Date().getFullYear()} TS Residence</span>
            <a
              href="#"
              className="transition-colors duration-300 hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="transition-colors duration-300 hover:text-white"
            >
              Terms
            </a>
          </div>
          <Link
            href="/"
            className="text-[10px] tracking-[0.15em] text-white/40 uppercase transition-colors duration-300 hover:text-white/70"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
