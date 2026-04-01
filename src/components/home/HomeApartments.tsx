import { ArrowRight } from "lucide-react";
import { BTN_GOLD } from "../../constants";
import { StaggerContainer, StaggerItem } from "../animations";
import type { Page } from "../../types";

interface Apartment {
  name: string;
  sqm: string;
  bed: string;
  desc: string;
  img: string;
  page: Page;
}

interface HomeApartmentsProps {
  setPage: (p: Page) => void;
  apartments: Apartment[];
}

export const HomeApartments = ({
  setPage,
  apartments,
}: HomeApartmentsProps) => (
  <section className="bg-white px-6 py-14 md:px-12 md:py-20 lg:px-20 lg:py-32 xl:px-28">
    <div className="mb-10 flex flex-col gap-6 md:mb-14 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <span className="label-caps text-gold">Suites &amp; Apartments</span>
        <h2 className="heading-section text-ink mt-5">
          Find Your Perfect Space
        </h2>
        <p className="text-body text-ink-light mt-6 max-w-2xl">
          Each residence is composed with generous proportions, understated
          finishes, and the comfort of a fully serviced stay.
        </p>
      </div>

      <button
        onClick={() => setPage("apartments")}
        className={`${BTN_GOLD} border-gold-dark text-gold-dark hover:bg-gold-dark self-start lg:self-auto`}
      >
        View All <ArrowRight size={14} />
      </button>
    </div>

    <StaggerContainer
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10"
      staggerDelay={0.15}
    >
      {apartments.map((apt, i) => (
        <StaggerItem key={i}>
          <div
            onClick={() => setPage(apt.page)}
            onKeyDown={(e) => e.key === "Enter" && setPage(apt.page)}
            role="button"
            tabIndex={0}
            className="group w-full cursor-pointer text-left"
          >
            <div className="relative aspect-3/4 overflow-hidden sm:aspect-4/5">
              <img
                src={apt.img}
                alt={apt.name}
                className="h-full w-full object-cover transition-transform duration-1600 ease-out group-hover:scale-[1.05]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-7 text-white md:p-8">
                <span className="text-[12px] tracking-[0.24em] text-white/72 uppercase">
                  {apt.sqm} sqm &middot; {apt.bed}
                </span>
              </div>
            </div>

            <div className="border-gold/20 border-x border-b px-6 py-8 md:px-8 md:py-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-ink font-serif text-[2rem] leading-none md:text-[2.4rem]">
                    {apt.name}
                  </h3>
                  <p className="text-body text-ink-light mt-4">{apt.desc}</p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-muted group-hover:text-gold mt-1 shrink-0 transition-all group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  </section>
);
