import Link from "next/link";
import { FadeInView, StaggerItem } from "../animations";
import { BTN_GOLD } from "../site/buttons";

const AUDIENCES = ["Digital Nomads", "Expats", "Creatives", "Young Families"];

export const HomeResidents = () => (
  <section
    data-reveal-profile="hero"
    className="border-gold/25 border-b bg-white px-5 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-28"
  >
    <div className="mx-auto max-w-700 text-center">
      <FadeInView delay={0.1}>
        <h2 className="text-ink font-serif text-[2.25rem] leading-[1.05] md:text-[3.2rem] lg:text-[3.6rem]">
          TS Residence is for Easy Living.
        </h2>
      </FadeInView>

      <FadeInView delay={0.18}>
        <p className="text-body text-ink-light mt-6 mx-auto max-w-[64ch] text-[0.9rem] leading-[1.68] md:mt-8 md:text-[1rem] md:leading-[1.8] text-center">
          Built for long-stay residents who want privacy, structure, and better
          daily living in Seminyak.
        </p>
      </FadeInView>

      <FadeInView delay={0.2}>
        <div className="mt-8 grid grid-cols-4 gap-2 md:gap-3 lg:gap-4">
          {AUDIENCES.map((item) => (
            <StaggerItem key={item} className="min-w-0">
              <div className="border-gold/20 bg-cream flex min-h-11 min-w-0 items-center justify-center border px-1.5 py-2 text-center md:min-h-12 md:px-3">
                <p className="text-ink w-full text-center font-serif text-[clamp(0.66rem,2.65vw,0.92rem)] leading-[1.05] md:text-[0.95rem]">
                  {item}
                </p>
              </div>
            </StaggerItem>
          ))}
        </div>
      </FadeInView>
    </div>

    <div className="mx-auto max-w-1200 mt-16 lg:mt-20">
      <FadeInView delay={0.3}>
        <div className="flex items-end justify-center gap-3 text-center md:gap-4">
          <p className="text-gold font-serif text-[120px] leading-none md:text-[140px] lg:text-[150px]">
            <span data-reveal-counter="66">66</span>
          </p>
          <p className="label-caps text-ink/65 mb-5 text-[0.95rem] md:mb-6 md:text-[1rem] lg:mb-7 lg:text-[1.05rem]">
            Units
          </p>
        </div>
      </FadeInView>

      <FadeInView delay={0.4} className="mt-6 lg:mt-8 text-center">
        <p className="text-ink/85 mx-auto max-w-150 text-lg leading-[1.6]">
          Modern, spacious premium design apartments built for
          EASY LIVING with hotel-grade access and long-stay comfort.
        </p>
      </FadeInView>

      <FadeInView delay={0.5} className="mt-10 lg:mt-12 text-center">
        <Link href="/contact" className={BTN_GOLD}>
          Book Your Stay
        </Link>
      </FadeInView>
    </div>
  </section>
);