import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-bg text-white">
      <div className="section-shell grid grid-cols-1 gap-12 pt-20 pb-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-8 lg:col-span-4">
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex items-baseline">
              <span className="text-4xl font-light">T</span>
              <span className="text-4xl font-light">S</span>
            </div>
            <span className="text-[8px] font-semibold uppercase tracking-[0.45em] text-white/50">
              Residence
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/40">
            A new living concept combining five-star luxury, wellness, and
            convenience in the heart of Seminyak, Bali.
          </p>
        </div>

        <div className="lg:col-span-2">
          <h4 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
            Stay
          </h4>
          <ul className="space-y-3 text-sm text-white/40">
            <li>
              <Link href="/apartments/solo" className="hover:text-white">
                SOLO Apartment
              </Link>
            </li>
            <li>
              <Link href="/apartments/studio" className="hover:text-white">
                STUDIO Apartment
              </Link>
            </li>
            <li>
              <Link href="/apartments/soho" className="hover:text-white">
                SOHO Apartment
              </Link>
            </li>
            <li>
              <Link href="/offers" className="hover:text-white">
                Special Offers
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
            Experience
          </h4>
          <ul className="space-y-3 text-sm text-white/40">
            <li>
              <Link href="/five-star" className="hover:text-white">
                Five-Star Living
              </Link>
            </li>
            <li>
              <Link href="/healthy-living" className="hover:text-white">
                Wellness Club
              </Link>
            </li>
            <li>
              <Link href="/easy-living" className="hover:text-white">
                Easy Living
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-white">
                Gallery
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4 text-sm text-white/40 lg:col-span-4">
          <h4 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
            Contact
          </h4>
          <p>
            Jl. Nakula No.18, Legian, Seminyak, Kec. Kuta, Kabupaten Badung,
            Bali 80361
          </p>
          <p>tsresidence@townsquare.co.id</p>
          <p>+62 811 1902 8111</p>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="section-shell flex flex-col items-center justify-between gap-4 py-6 text-[10px] uppercase tracking-[0.15em] text-white/30 md:flex-row">
          <span>&copy; {year} TS Residence</span>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
