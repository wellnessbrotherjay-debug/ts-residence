import Link from "next/link";
import { apartments, homePillars } from "@/lib/site-data";
import { BTN_GOLD, BTN_LIGHT, BTN_SOLID } from "./buttons";
import { FadeInView, StaggerContainer, StaggerItem } from "./animations";

export function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <HeadlineSection />
      <PillarsSection />
      <WhySeminyakSection />
      <ApartmentsSection />
      <OffersSection />
      <YourHomeSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-cream">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80"
      >
        <source
          src="https://www.hive68.com/wp-content/uploads/2019/10/Clip-1.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/65" />
      <div className="section-shell relative flex min-h-[100svh] items-end pb-16 md:pb-20 lg:pb-28">
        <FadeInView className="max-w-[920px] text-white">
          <span className="label-caps text-gold/90">Welcome To</span>
          <h1 className="heading-display mt-6 text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[11rem]">
            TS Residence
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/80">
            Five-star long-stay apartments in the heart of Seminyak, composed
            around hospitality, wellness, and effortless daily living.
          </p>
        </FadeInView>
      </div>
    </section>
  );
}

function HeadlineSection() {
  return (
    <section className="bg-white py-24 lg:py-40">
      <div className="section-shell text-center">
        <FadeInView>
          <span className="label-caps text-gold">Seminyak, Bali</span>
        </FadeInView>
        <FadeInView delay={0.15}>
          <h2 className="mt-6 font-serif text-5xl leading-[1.02] tracking-[-0.03em] text-ink md:text-7xl lg:text-8xl xl:text-[7rem]">
            Where five-star
            <br />
            <em className="not-italic text-gold">hospitality</em> meets
            <br />
            long-stay living.
          </h2>
        </FadeInView>
        <FadeInView delay={0.3}>
          <p className="mx-auto mt-10 max-w-2xl text-body text-ink/80">
            TS Residence by TS Suites offers premium apartments for monthly
            living, with a calm and highly serviced experience in one of
            Bali&apos;s most desirable neighborhoods.
          </p>
        </FadeInView>
        <FadeInView delay={0.4}>
          <div className="mt-12 flex justify-center">
            <Link href="/contact" className={BTN_GOLD}>
              Explore More
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

function PillarsSection() {
  return (
    <section className="bg-white pb-24 lg:pb-32">
      <div className="section-shell">
        <FadeInView className="mx-auto max-w-[920px] text-center">
          <span className="label-caps text-gold">Our Philosophy</span>
          <h2 className="heading-section mt-5">
            Three Pillars of Elevated Living
          </h2>
          <p className="mx-auto mt-6 max-w-[720px] text-body text-ink/80">
            The experience is shaped with the same precision as a grand hotel:
            composed service, restorative wellness, and convenience that feels
            quiet rather than transactional.
          </p>
        </FadeInView>
      </div>

      <StaggerContainer
        className="mt-16 grid grid-cols-1 gap-px bg-gold/20 lg:grid-cols-3"
        staggerDelay={0.15}
      >
        {homePillars.map((pillar) => (
          <StaggerItem key={pillar.href} className="bg-white">
            <Link href={pillar.href} className="group block w-full text-left">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
                  <p className="label-caps text-white/65">{pillar.stat}</p>
                  <div className="mt-5 text-[12px] uppercase tracking-[0.24em] text-white/90">
                    Discover
                  </div>
                </div>
              </div>
              <div className="min-h-[280px] px-6 py-8 md:px-8 md:py-10 lg:px-10">
                <h3 className="mt-8 text-[2.1rem] leading-none text-ink md:text-[2.5rem]">
                  {pillar.title}
                </h3>
                <p className="mt-5 text-body text-ink/80">
                  {pillar.description}
                </p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

function WhySeminyakSection() {
  return (
    <section className="grid grid-cols-1 bg-cream-dark lg:min-h-[100vh] lg:grid-cols-[1.2fr_0.8fr]">
      <FadeInView
        direction="left"
        className="relative min-h-[58vh] lg:min-h-full"
      >
        <div className="relative h-full w-full">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80"
            alt="TS Residence Pool"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-10 lg:p-14">
            <p className="label-caps text-white/65">Seminyak Atmosphere</p>
            <p className="mt-4 max-w-[26rem] text-[2rem] leading-none md:text-[2.6rem] lg:text-[3.2rem]">
              Resort calm with city access
            </p>
          </div>
        </div>
      </FadeInView>

      <div className="flex items-center px-6 py-20 md:px-12 lg:px-16 lg:py-24 xl:px-20">
        <div className="max-w-[34rem]">
          <FadeInView direction="right">
            <span className="label-caps text-gold">Why Seminyak</span>
            <h2 className="heading-section mt-5">
              Live where every day feels extraordinary
            </h2>
            <p className="mt-7 text-body text-ink/80">
              TS Residence places you in a neighborhood that feels both
              indulgent and practical, with the best of Bali always within easy
              reach.
            </p>
          </FadeInView>

          <FadeInView direction="right" delay={0.2}>
            <div className="mt-12 space-y-6 border-t border-gold/20 pt-8">
              {[
                "Strategically located with fast access to everything",
                "Safe, expat-friendly, and walkable neighborhood",
                "Vibrant culture, wellness, dining, and digital-friendly cafes",
                "Well-developed infrastructure with hospital, coworking, and retail",
                "Breathtaking beaches at your doorstep",
              ].map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <div className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <p className="text-body text-ink/80">{item}</p>
                </div>
              ))}
            </div>
          </FadeInView>

          <FadeInView direction="right" delay={0.35}>
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-gold/20 pt-8">
              {[
                ["Beach", "8 min"],
                ["Dining", "Walkable"],
                ["Wellness", "Daily access"],
                ["Lease", "Flexible"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="label-caps text-ink/55">{label}</p>
                  <p className="mt-3 text-[2rem] leading-none text-ink md:text-[2.4rem]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </FadeInView>

          <FadeInView direction="right" delay={0.45}>
            <Link href="/contact" className={`${BTN_SOLID} mt-12`}>
              Book Apartment
            </Link>
          </FadeInView>
        </div>
      </div>
    </section>
  );
}

function ApartmentsSection() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="section-shell">
        <div className="mb-14 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[48rem]">
            <span className="label-caps text-gold">
              Suites &amp; Apartments
            </span>
            <h2 className="heading-section mt-5">Find Your Perfect Space</h2>
            <p className="mt-6 max-w-[42rem] text-body text-ink/80">
              Each residence is composed with generous proportions, understated
              finishes, and the comfort of a fully serviced stay.
            </p>
          </div>
          <Link
            href="/apartments"
            className={`${BTN_GOLD} self-start lg:self-auto`}
          >
            View All
          </Link>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10"
          staggerDelay={0.15}
        >
          {apartments.map((apt) => (
            <StaggerItem key={apt.slug}>
              <Link href={`/apartments/${apt.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={apt.image}
                    alt={apt.name}
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-8">
                    <span className="text-[12px] uppercase tracking-[0.24em] text-white/72">
                      {apt.sqm} · {apt.bed}
                    </span>
                  </div>
                </div>
                <div className="border-x border-b border-gold/20 px-6 py-8 md:px-8 md:py-9">
                  <h3 className="text-[2rem] leading-none text-ink md:text-[2.4rem]">
                    {apt.name}
                  </h3>
                  <p className="mt-4 text-body text-ink/80">{apt.short}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function OffersSection() {
  return (
    <section className="relative min-h-[72vh] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"
        alt="Special Offers"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/54 to-black/40" />
      <div className="section-shell relative flex min-h-[72vh] items-end py-12 md:py-16 lg:py-20">
        <FadeInView className="max-w-[760px]">
          <span className="label-caps text-white/70">Limited Time</span>
          <h2 className="heading-display mt-6 text-5xl text-white sm:text-6xl md:text-7xl lg:text-[6.2rem]">
            Special Opening Celebration
          </h2>
          <p className="mt-7 max-w-[640px] text-body text-white/76">
            Stay 3 months, pay for 2. Available across all apartment categories
            for a more generous start in Seminyak.
          </p>
          <Link href="/offers" className={`${BTN_LIGHT} mt-10`}>
            View All Offers
          </Link>
        </FadeInView>
      </div>
    </section>
  );
}

function YourHomeSection() {
  return (
    <section className="grid grid-cols-1 bg-cream lg:min-h-[92vh] lg:grid-cols-[0.9fr_1.1fr]">
      <FadeInView
        direction="left"
        className="relative min-h-[56vh] lg:min-h-full"
      >
        <img
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"
          alt="Life at TS Residence"
          className="h-full w-full object-cover"
        />
      </FadeInView>

      <div className="flex items-center px-6 py-20 md:px-12 lg:px-16 lg:py-24 xl:px-20">
        <FadeInView direction="right" className="max-w-[40rem]">
          <span className="label-caps text-gold">Your Home in Bali</span>
          <h2 className="heading-section mt-5">
            TS Residence is composed for modern long-stay living
          </h2>
          <p className="mt-7 max-w-[36rem] text-body text-ink/80">
            Whether you&apos;re a digital nomad seeking inspiration, a couple
            embracing island life, or a family looking for a safe and connected
            base, TS Residence is designed to feel polished, practical, and
            warmly personal.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-px bg-gold/20 sm:grid-cols-2">
            {[
              "Digital nomads & remote workers",
              "Couples & young professionals",
              "Families with children",
              "Long-stay business travelers",
            ].map((item) => (
              <div key={item} className="bg-cream px-5 py-5">
                <span className="text-body text-ink/80">{item}</span>
              </div>
            ))}
          </div>
          <div className="soft-divider my-10" />
          <Link href="/contact" className={BTN_SOLID}>
            Book Apartment
          </Link>
        </FadeInView>
      </div>
    </section>
  );
}
