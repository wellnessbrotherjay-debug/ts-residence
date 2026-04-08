import { FadeInView, StaggerContainer, StaggerItem } from "../animations";

const AUDIENCES = ["Digital Nomads", "Expats", "Creatives", "Young Families"];

export const HomeResidents = () => (
  <section
    data-reveal-profile="cinematic"
    className="border-gold/25 border-b bg-white px-5 py-12 md:px-12 md:py-18 lg:px-20 lg:py-22 xl:px-28"
  >
    <div className="mx-auto max-w-240">
      <FadeInView className="max-w-180">
        <p className="label-caps text-gold">Resident Profile</p>
        <h2 className="text-ink mt-4 font-serif text-[1.95rem] leading-[1.04] md:text-[3rem] lg:text-[3.4rem]">
          TS Residence is for people like you.
        </h2>
        <p className="text-body text-ink-light mt-5 max-w-[64ch] text-[0.97rem] leading-7 md:mt-6 md:text-base md:leading-8">
          Built for long-stay residents who want privacy, structure, and better
          daily living in Seminyak.
        </p>
      </FadeInView>

      <StaggerContainer
        className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-4"
        staggerDelay={0.08}
      >
        {AUDIENCES.map((item) => (
          <StaggerItem
            key={item}
            className="border-gold/20 bg-cream border px-5 py-5 text-center md:px-6 md:py-7"
          >
            <p className="text-ink font-serif text-[1.3rem] leading-[1.04] md:text-[1.7rem]">
              {item}
            </p>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeInView delay={0.18}>
        <div className="border-gold/20 mt-8 grid grid-cols-1 gap-5 border-t pt-7 lg:mt-10 lg:grid-cols-[12rem_1fr] lg:items-start lg:gap-6 lg:pt-8">
          <div>
            <p
              data-reveal-counter="66"
              className="text-gold font-serif text-[2.7rem] leading-none md:text-[4rem]"
            >
              66
            </p>
            <p className="label-caps text-ink/55 mt-3">Units</p>
          </div>
          <p className="text-ink/82 max-w-[56ch] text-[0.98rem] leading-7 md:text-[1.14rem] md:leading-9">
            66 units of modern, spacious premium design apartments built for
            monthly living with hotel-grade access and long-stay comfort.
          </p>
        </div>
      </FadeInView>
    </div>
  </section>
);
