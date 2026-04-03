import { BTN_GOLD } from "../../constants";
import { FadeInView } from "../animations";
import type { Page } from "../../types";

export const HomeHeadline = ({ setPage }: { setPage: (p: Page) => void }) => (
  <section className="bg-white px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-18 xl:px-28">
    <div className="mx-auto max-w-220">
      <FadeInView>
        <div className="flex items-center justify-center gap-4">
          <span className="bg-gold/35 h-px w-10" />
          <span className="label-caps text-gold">Seminyak, Bali</span>
          <span className="bg-gold/35 h-px w-10" />
        </div>
      </FadeInView>

      <FadeInView delay={0.12}>
        <div className="mt-8 text-center">
          <h2 className="text-ink mx-auto max-w-205 font-serif text-[1.95rem] leading-[1.14] font-normal tracking-[-0.035em] md:text-[2.55rem] lg:text-[3rem] xl:text-[3.35rem]">
            TS RESIDENCE is a new living concept by TS Suites that combines
            Five Star, Healthy and Easy Living by being in Seminyak&apos;s
            premier location.
          </h2>
        </div>
      </FadeInView>

      <FadeInView delay={0.22}>
        <p className="text-body text-ink-light mx-auto mt-6 max-w-160 text-center text-[0.98rem] leading-[1.7] md:text-[1.02rem]">
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
