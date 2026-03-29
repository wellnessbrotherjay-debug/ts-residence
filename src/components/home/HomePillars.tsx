import { ArrowRight, Dumbbell, Star, Waves } from "lucide-react";
import { FadeInView, StaggerContainer, StaggerItem } from "../animations";
import type { Page } from "../../types";

const PILLARS = [
  {
    title: "Five-Star Living",
    desc: "Full privileges of a luxury hotel with coworking, dining, salon, and retail in one polished address.",
    page: "five-star" as Page,
    img: "https://picsum.photos/seed/fivestar-card/1200/1600",
    icon: <Star size={20} />,
    stat: "Hotel-grade privileges",
  },
  {
    title: "Healthy Living",
    desc: "Daily yoga, reformer Pilates, sauna, cold bath, and IV therapy curated for a restorative routine.",
    page: "healthy" as Page,
    img: "https://picsum.photos/seed/healthy-card/1200/1600",
    icon: <Dumbbell size={20} />,
    stat: "Daily wellness access",
  },
  {
    title: "Easy Living",
    desc: "A seamless monthly stay near Seminyak Beach with concierge support and effortless day-to-day convenience.",
    page: "easy" as Page,
    img: "https://picsum.photos/seed/easy-card/1200/1600",
    icon: <Waves size={20} />,
    stat: "Flexible long-stay living",
  },
];

export const HomePillars = ({ setPage }: { setPage: (p: Page) => void }) => (
  <section className="bg-white">
    <div className="px-6 py-24 md:px-12 lg:px-20 lg:py-32 xl:px-28">
      <FadeInView className="mx-auto max-w-[920px] text-center">
        <span className="label-caps text-gold">Our Philosophy</span>
        <h2 className="heading-section mt-5 text-ink">
          Three Pillars of Elevated Living
        </h2>
        <p className="text-body mx-auto mt-6 max-w-[720px] text-ink-light">
          The experience is shaped with the same precision as a grand hotel:
          composed service, deeply restorative wellness, and convenience that
          feels quiet rather than transactional.
        </p>
      </FadeInView>
    </div>

    <StaggerContainer
      className="grid grid-cols-1 gap-px bg-black/8 lg:grid-cols-3"
      staggerDelay={0.15}
    >
      {PILLARS.map((pillar, i) => (
        <StaggerItem key={i} className="bg-white">
          <button
            onClick={() => setPage(pillar.page)}
            className="group block w-full text-left"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={pillar.img}
                alt={pillar.title}
                className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
                <p className="label-caps text-white/65">{pillar.stat}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.24em] text-white/90">
                  Discover <ArrowRight size={14} />
                </div>
              </div>
            </div>

            <div className="min-h-[280px] px-6 py-8 md:px-8 md:py-10 lg:px-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold">
                {pillar.icon}
              </span>
              <h3 className="mt-8 font-serif text-[2.1rem] leading-none text-ink md:text-[2.5rem]">
                {pillar.title}
              </h3>
              <p className="mt-5 text-body text-ink-light">{pillar.desc}</p>
            </div>
          </button>
        </StaggerItem>
      ))}
    </StaggerContainer>
  </section>
);
