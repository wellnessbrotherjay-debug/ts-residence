import { BTN_LIGHT } from "../../constants";
import { FadeInView } from "../animations";
import type { Page } from "../../types";

export const HomeOffers = ({ setPage }: { setPage: (p: Page) => void }) => (
  <section className="relative min-h-[72vh] overflow-hidden">
    <img
      src="https://picsum.photos/seed/offer-hero/1920/1080"
      alt="Special Offers"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/54 to-black/40" />
    <div className="relative flex min-h-[72vh] items-end px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-20 xl:px-28">
      <FadeInView className="max-w-[760px]">
        <span className="label-caps text-gold-light">Limited Time</span>
        <h2 className="heading-display mt-6 text-5xl text-white sm:text-6xl md:text-7xl lg:text-[6.2rem]">
          Special Opening Celebration
        </h2>
        <p className="mt-7 max-w-[640px] text-body text-white/76">
          Stay 3 months, pay for 2. Available across all apartment categories
          for a more generous start in Seminyak.
        </p>
        <button
          onClick={() => setPage("offers")}
          className={`${BTN_LIGHT} mt-10`}
        >
          View All Offers
        </button>
      </FadeInView>
    </div>
  </section>
);
