import { ArrowRight } from "lucide-react";
import { BTN_GOLD } from "../../constants";
import { StaggerContainer, StaggerItem } from "../animations";
import { EditableImage } from "../EditableImage";
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
  onImageChange: (index: number, url: string) => void;
}

export const HomeApartments = ({
  setPage,
  apartments,
  onImageChange,
}: HomeApartmentsProps) => (
  <section className="bg-white px-6 py-24 md:px-12 lg:px-20 lg:py-32 xl:px-28">
    <div className="mb-14 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-[48rem]">
        <span className="label-caps text-gold">Suites &amp; Apartments</span>
        <h2 className="heading-section mt-5 text-ink">
          Find Your Perfect Space
        </h2>
        <p className="text-body mt-6 max-w-[42rem] text-ink-light">
          Each residence is composed with generous proportions, understated
          finishes, and the comfort of a fully serviced stay.
        </p>
      </div>

      <button
        onClick={() => setPage("apartments")}
        className={`${BTN_GOLD} self-start lg:self-auto`}
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
            <div className="relative aspect-[4/5] overflow-hidden">
              <EditableImage
                src={apt.img}
                alt={apt.name}
                category={apt.page}
                className="h-full w-full"
                onImageChange={(url) => onImageChange(i, url)}
              >
                {(src: string) => (
                  <img
                    src={src}
                    alt={apt.name}
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
                    referrerPolicy="no-referrer"
                  />
                )}
              </EditableImage>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-8">
                <span className="text-[12px] uppercase tracking-[0.24em] text-white/72">
                  {apt.sqm} sqm &middot; {apt.bed}
                </span>
              </div>
            </div>

            <div className="border-x border-b border-black/8 px-6 py-8 md:px-8 md:py-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-[2rem] leading-none text-ink md:text-[2.4rem]">
                    {apt.name}
                  </h3>
                  <p className="mt-4 text-body text-ink-light">{apt.desc}</p>
                </div>
                <ArrowRight
                  size={18}
                  className="mt-1 shrink-0 text-muted transition-all group-hover:translate-x-1 group-hover:text-gold"
                />
              </div>
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  </section>
);
