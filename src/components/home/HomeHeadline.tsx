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
        <h2 className="mt-6 font-serif font-normal text-5xl leading-[1.02] tracking-[-0.03em] text-ink md:text-7xl lg:text-8xl xl:text-[7rem]">
          Where five-star
          <br />
          <em className="not-italic text-gold">hospitality</em> meets
          <br />
          long-stay living.
        </h2>
      </FadeInView>
      <FadeInView delay={0.3}>
        <p className="mx-auto mt-10 max-w-2xl text-body text-ink-light">
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
      <div className="mt-20 grid grid-cols-1 border-t border-black/8 md:grid-cols-3">
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
            className="px-0 py-10 text-center md:px-10 lg:px-14 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-black/8 md:[&:not(:last-child)]:border-b-0 md:[&:not(:last-child)]:border-r"
          >
            <p className="label-caps text-gold">{title}</p>
            <p className="mt-5 text-body text-ink-light">{desc}</p>
          </div>
        ))}
      </div>
    </FadeInView>
  </section>
);
