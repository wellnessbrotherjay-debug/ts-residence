import { BTN_LIGHT } from "../../constants";
import { FadeInView } from "../animations";
import type { Page } from "../../types";

export const HomeOffers = ({ setPage }: { setPage: (p: Page) => void }) => (
  <section className="relative min-h-[56vh] overflow-hidden md:min-h-[64vh] lg:min-h-[72vh]">
    <img
      src="https://picsum.photos/seed/offer-hero/1920/1080"
      alt="Special Offers"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/65 to-black/45" />
    <div className="relative flex min-h-[56vh] items-end px-6 py-12 md:min-h-[64vh] md:px-12 md:py-16 lg:min-h-[72vh] lg:px-20 lg:py-20 xl:px-28">
      <div className="max-w-190">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 md:p-8 mb-6 md:mb-8">
          <span className="label-caps text-gold-light">Limited Time</span>
          <h2 className="heading-display mt-6 text-5xl text-white sm:text-6xl md:text-7xl lg:text-[6.2rem]">
            Special Opening Celebration
          </h2>
        </div>
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 md:p-8">
          <p className="text-body max-w-160 text-white/90">
            Stay 3 months, pay for 2 on the SOLO unit only, for a more generous
            start in Seminyak.
          </p>
          <button
            onClick={() => setPage("offers")}
            className={`${BTN_LIGHT} mt-6 md:mt-8`}
          >
            View All Offers
          </button>
        </div>
      </div>
    </div>
  </section>
);
