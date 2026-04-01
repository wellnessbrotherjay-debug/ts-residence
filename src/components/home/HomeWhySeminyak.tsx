import { BTN_SOLID } from "../../constants";
import { FadeInView } from "../animations";
import type { Page } from "../../types";

interface HomeWhySeminyakProps {
  setPage: (p: Page) => void;
  imgSrc: string;
}

export const HomeWhySeminyak = ({ setPage, imgSrc }: HomeWhySeminyakProps) => (
  <section className="border-gold/35 bg-cream-dark grid grid-cols-1 border-y lg:min-h-screen lg:grid-cols-[1.2fr_0.8fr]">
    <FadeInView
      direction="left"
      className="relative min-h-[40vh] md:min-h-[50vh] lg:min-h-full"
    >
      <div className="relative h-full w-full">
        <img
          src={imgSrc}
          alt="TS Residence Pool"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-8 text-white md:p-10 lg:p-14">
          <p className="label-caps text-white/65">Seminyak Atmosphere</p>
          <p className="mt-4 max-w-104 font-serif text-[2rem] leading-none md:text-[2.6rem] lg:text-[3.2rem]">
            Resort calm with city access
          </p>
        </div>
      </div>
    </FadeInView>

    <div className="flex items-center px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-24 xl:px-20">
      <div className="max-w-136">
        <FadeInView direction="right">
          <span className="label-caps text-gold">Why Seminyak</span>
          <h2 className="heading-section text-ink mt-5">
            Live where every day feels extraordinary
          </h2>
          <p className="text-body text-ink-light mt-7">
            TS Residence places you in a neighborhood that feels both indulgent
            and practical, with the best of Bali always within easy reach.
          </p>
        </FadeInView>

        <FadeInView direction="right" delay={0.2}>
          <div className="border-gold/20 mt-8 space-y-4 border-t pt-6 md:mt-10 md:space-y-6 md:pt-8 lg:mt-12">
            {[
              "Strategically located with fast access to everything",
              "Safe, expat-friendly, and walkable neighborhood",
              "Vibrant culture, wellness, dining, and digital-friendly cafes",
              "Well-developed infrastructure with hospital, co-working, and retail",
              "Breathtaking beaches at your doorstep",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="bg-gold mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full" />
                <p className="text-body text-ink-light">{item}</p>
              </div>
            ))}
          </div>
        </FadeInView>

        <FadeInView direction="right" delay={0.35}>
          <div className="border-gold/20 mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-6 md:mt-10 md:gap-y-8 md:pt-8 lg:mt-12">
            {[
              ["Beach", "8 min"],
              ["Dining", "Walkable"],
              ["Wellness", "Daily access"],
              ["Lease", "Flexible"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="label-caps text-ink/55">{label}</p>
                <p className="text-ink mt-3 font-serif text-[2rem] leading-none md:text-[2.4rem]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </FadeInView>

        <FadeInView direction="right" delay={0.45}>
          <button
            onClick={() => setPage("contact")}
            className={`${BTN_SOLID} mt-8 md:mt-10 lg:mt-12`}
          >
            Book Apartment
          </button>
        </FadeInView>
      </div>
    </div>
  </section>
);
