import { OffersHero } from "@/components/offers/OffersHero";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/site/animations";
import { offers } from "@/lib/site-data";

const WHATSAPP_NUMBER = "6281119028111";

const buildOfferWhatsAppUrl = (offerTitle: string) => {
  const draft = `Hi TS Residence, I'm interested in ${offerTitle}. Please share availability and complete terms.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(draft)}`;
};

export default function Page() {
  const featured = offers[0];
  const listing = offers.slice(1);

  return (
    <div className="relative isolate overflow-x-hidden">
      <OffersHero ctaHref={buildOfferWhatsAppUrl(featured.title)} />

      <section className="border-gold/30 bg-cream/96 relative z-10 mt-10 border-b py-16 md:mt-14 md:py-24 lg:mt-18">
        <div className="section-shell px-6 md:px-12 lg:px-20 xl:px-28">
          <FadeInView className="section-header text-center">
            <p className="label-caps text-gold">More Offers</p>
            <h2 className="text-ink font-serif text-3xl leading-tight md:text-5xl">
              Explore the other offers
              <br />
              available now.
            </h2>
          </FadeInView>

          <StaggerContainer
            className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
            staggerDelay={0.14}
          >
            {listing.map((offer, idx) => (
              <StaggerItem
                key={offer.title + String(idx)}
                className="card-surface group h-full overflow-hidden"
              >
                <article className="flex h-full flex-col">
                  <div className="h-56 overflow-hidden md:h-64">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="h-full w-full object-cover transition-transform duration-1700 ease-out group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7 md:p-8">
                    <div className="bg-cream/90 mb-4 rounded-lg p-3 backdrop-blur-sm md:p-4">
                      <p className="text-gold-dark text-[11px] font-semibold tracking-[0.24em] uppercase">
                        {String(idx + 2).padStart(2, "0")}
                      </p>
                    </div>
                    <h3 className="text-ink mt-4 min-h-24 font-serif text-[2rem] leading-[1.02]">
                      {offer.title}
                    </h3>
                    <p className="text-ink/76 mt-5 flex-1 text-[1rem] leading-8">
                      {offer.description}
                    </p>
                    <a
                      href={buildOfferWhatsAppUrl(offer.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-gold bg-gold hover:bg-gold-dark mt-8 inline-flex min-h-12 items-center justify-center border px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition-all duration-400"
                    >
                      Explore This Offer
                    </a>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-gold/30 relative z-10 mt-10 border-b bg-white/96 py-16 md:mt-14 md:py-24 lg:mt-18">
        <div className="section-shell px-6 md:px-12 lg:px-20 xl:px-28">
          <FadeInView className="mx-auto max-w-4xl text-center">
            <p className="label-caps text-gold">Find Out More</p>
            <h2 className="text-ink mt-4 font-serif text-3xl leading-tight md:text-5xl">
              Speak to us on WhatsApp
              <br />
              to find the right offer.
            </h2>
            <p className="text-ink/76 mx-auto mt-6 max-w-3xl text-[1rem] leading-8">
              We&apos;ll help you understand availability, apartment options,
              stay terms, and which offer fits your plan best.
            </p>
            <a
              href="https://wa.me/6281119028111"
              target="_blank"
              rel="noopener noreferrer"
              className="border-gold bg-gold hover:bg-gold-dark mt-8 inline-flex min-h-12 items-center justify-center border px-7 py-3.5 text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition-all duration-400 md:min-h-13.5 md:px-9 md:py-4 md:text-[12px] md:tracking-[0.22em]"
            >
              Speak On WhatsApp
            </a>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
