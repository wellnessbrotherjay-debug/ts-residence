import { BTN_GOLD } from "../../constants";
import { FadeInView } from "../animations";
import type { Page } from "../../types";

export const HomeHeadline = ({ setPage }: { setPage: (p: Page) => void }) => (
  <section className="bg-white px-6 py-24 md:px-12 lg:px-20 lg:py-40 xl:px-28">
    <div className="text-center">
      <FadeInView>
        <span className="label-caps text-gold">Seminyak, Bali</span>
      </FadeInView>
      <FadeInView delay={0.15}>
        <h2 className="text-ink mt-6 font-serif text-5xl leading-[1.02] font-normal tracking-[-0.03em] md:text-7xl lg:text-8xl xl:text-[7rem]">
          Where five-star
          <br />
          <em className="text-gold not-italic">hospitality</em> meets
          <br />
          long-stay living.
        </h2>
      </FadeInView>
      <FadeInView delay={0.3}>
        <p className="text-body text-ink-light mx-auto mt-10 max-w-2xl">
          TS Residence by TS Suites offers premium apartments for monthly living
          — a calm, highly serviced experience in one of Bali&apos;s most
          desirable neighborhoods.
        </p>
      </FadeInView>
      <FadeInView delay={0.4}>
        <div className="mt-12 flex justify-center">
          <button onClick={() => setPage("contact")} className={BTN_GOLD}>
            Explore More
          </button>
        </div>
      </FadeInView>
    </div>

    <FadeInView delay={0.5}>
      <div className="border-gold/35 mt-20 grid grid-cols-1 border-t md:grid-cols-3">
        {[
          [
            "Prime Address",
            "Steps from Seminyak's best dining, beach clubs, and lifestyle spots",
          ],
          [
            "Wellness Access",
            "Integrated facilities for movement, recovery, and daily self-care",
          ],
          [
            "Long-Stay Ease",
            "Monthly living with hospitality standards and concierge attention",
          ],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="not-last:border-gold/20 px-0 py-10 text-center not-last:border-b md:px-10 md:not-last:border-r md:not-last:border-b-0 lg:px-14"
          >
            <p className="label-caps text-gold">{title}</p>
            <p className="text-body text-ink-light mt-5">{desc}</p>
          </div>
        ))}
      </div>
    </FadeInView>
  </section>
);
