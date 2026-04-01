import { BTN_SOLID } from "../../constants";
import { FadeInView } from "../animations";
import type { Page } from "../../types";

interface HomeYourHomeProps {
  setPage: (p: Page) => void;
  imgSrc: string;
}

export const HomeYourHome = ({ setPage, imgSrc }: HomeYourHomeProps) => (
  <section className="bg-cream grid grid-cols-1 lg:min-h-[92vh] lg:grid-cols-[0.9fr_1.1fr]">
    <FadeInView
      direction="left"
      className="relative min-h-[38vh] md:min-h-[48vh] lg:min-h-full"
    >
      <img
        src={imgSrc}
        alt="Life at TS Residence"
        className="h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />
    </FadeInView>

    <div className="flex items-center px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-24 xl:px-20">
      <FadeInView direction="right" className="max-w-160">
        <span className="label-caps text-gold">Your Home in Bali</span>
        <h2 className="heading-section text-ink mt-5">
          TS Residence is composed for modern long-stay living
        </h2>
        <p className="text-body text-ink-light mt-7 max-w-xl">
          Whether you&apos;re a digital nomad seeking inspiration, a couple
          embracing island life, or a family looking for a safe and connected
          base, TS Residence is designed to feel polished, practical, and warmly
          personal.
        </p>

        <div className="bg-gold/20 mt-8 grid grid-cols-1 gap-px sm:grid-cols-2 md:mt-10 lg:mt-12">
          {[
            "Digital nomads & remote workers",
            "Couples & young professionals",
            "Families with children",
            "Long-stay business travelers",
          ].map((item, i) => (
            <div key={i} className="bg-cream px-5 py-5">
              <span className="text-body text-ink-light">{item}</span>
            </div>
          ))}
        </div>

        <div className="soft-divider my-7 md:my-10" />

        <button onClick={() => setPage("contact")} className={BTN_SOLID}>
          Book Apartment
        </button>
      </FadeInView>
    </div>
  </section>
);
