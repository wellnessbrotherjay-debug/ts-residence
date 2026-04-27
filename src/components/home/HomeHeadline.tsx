import { BTN_GOLD } from "../../constants";
import { FadeInView } from "../animations";
import type { Page } from "../../types";

export const HomeHeadline = ({ setPage }: { setPage: (p: Page) => void }) => (
  <section
    data-reveal-profile="hero"
    className="bg-white px-5 pt-4 pb-10 md:px-12 md:pt-8 md:pb-16 lg:px-20 lg:pt-10 lg:pb-18 xl:px-28"
  >
    <div className="mx-auto max-w-220">
      <FadeInView>
        <div className="flex items-center justify-center gap-4">
          <span className="bg-gold/35 h-px w-10" />
          <span className="label-caps text-gold">Seminyak, Bali</span>
          <span className="bg-gold/35 h-px w-10" />
        </div>
      </FadeInView>

      <FadeInView delay={0.12}>
        <div className="mt-7 text-center md:mt-8">
          <h2 className="text-ink mx-auto max-w-205 font-serif text-[1.55rem] leading-[1.12] font-normal tracking-[-0.03em] sm:text-[1.72rem] md:text-[2.55rem] lg:text-[3rem] xl:text-[3.35rem]">
            TS RESIDENCE is a new living concept by TS Suites that combines Five
            Star, Healthy and Easy Living by being in Seminyak&apos;s premier
            location.
          </h2>
        </div>
      </FadeInView>

      <FadeInView delay={0.22}>
        <p className="text-body text-ink-light mx-auto mt-5 max-w-160 text-center text-[0.94rem] leading-[1.65] md:mt-6 md:text-[1.02rem]">
          Apartments designed for monthly rental for your indefinite long stay
          in Bali.
        </p>
      </FadeInView>

      <FadeInView delay={0.32}>
        <div className="mt-7 flex justify-center">
          <button onClick={() => setPage("contact")} className={BTN_GOLD}>
            Explore More
          </button>
        </div>
      </FadeInView>
    </div>
  </section>
);
