import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "../components/animations";

export const EasyLivingPage = () => (
  <div className="pt-32 pb-20">
    <section className="mx-auto max-w-[1400px] px-6 text-center md:px-10">
      <FadeInView>
        <span className="label-caps text-gold">Convenience & Freedom</span>
        <h1 className="heading-display text-ink mt-4 mb-6 text-5xl md:text-6xl lg:text-7xl">
          Easy Living
        </h1>
        <p className="text-body mx-auto mb-6 max-w-2xl">
          Apartments designed for monthly rentals, for your hassle-free
          long-stay in Bali.
        </p>
      </FadeInView>

      <StaggerContainer
        className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3 lg:gap-16"
        staggerDelay={0.15}
      >
        {[
          {
            title: "Location",
            desc: "Walking distance to Seminyak Beach and Sunset Road. The best of Bali at your doorstep.",
          },
          {
            title: "Convenience",
            desc: "Flexible monthly leases and personalized concierge to handle your daily needs stress-free.",
          },
          {
            title: "Security",
            desc: "24/7 professional security team and secure residential access for total peace of mind.",
          },
        ].map((item, i) => (
          <StaggerItem key={i}>
            <div className="space-y-4 text-center">
              <span className="text-gold font-serif text-4xl">0{i + 1}</span>
              <h4 className="text-ink font-serif text-xl">{item.title}</h4>
              <p className="text-body">{item.desc}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeInView className="mt-24">
        <div className="mx-auto aspect-[21/9] max-w-[1200px] overflow-hidden">
          <img
            src="https://picsum.photos/seed/seminyak-location/1920/800"
            alt="Seminyak Location"
            className="h-full w-full object-cover"
          />
        </div>
      </FadeInView>
    </section>
  </div>
);
