import { BTN_SOLID } from "../../constants";
import { FadeInView } from "../animations";
import { EditableImage } from "../EditableImage";
import type { Page } from "../../types";

interface HomeYourHomeProps {
  setPage: (p: Page) => void;
  imgSrc: string;
}

export const HomeYourHome = ({ setPage, imgSrc }: HomeYourHomeProps) => (
  <section className="grid grid-cols-1 bg-cream lg:min-h-[92vh] lg:grid-cols-[0.9fr_1.1fr]">
    <FadeInView
      direction="left"
      className="relative min-h-[56vh] lg:min-h-full"
    >
      <div className="h-full w-full">
        <EditableImage
          src={imgSrc}
          alt="Life at TS Residence"
          category="general"
          className="h-full w-full"
          onImageChange={() => {}}
        >
          {(src: string) => (
            <img
              src={src}
              alt="Life at TS Residence"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </EditableImage>
      </div>
    </FadeInView>

    <div className="flex items-center px-6 py-20 md:px-12 lg:px-16 lg:py-24 xl:px-20">
      <FadeInView direction="right" className="max-w-[40rem]">
        <span className="label-caps text-gold">Your Home in Bali</span>
        <h2 className="heading-section mt-5 text-ink">
          TS Residence is composed for modern long-stay living
        </h2>
        <p className="text-body mt-7 max-w-[36rem] text-ink-light">
          Whether you&apos;re a digital nomad seeking inspiration, a couple
          embracing island life, or a family looking for a safe and connected
          base, TS Residence is designed to feel polished, practical, and warmly
          personal.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-px bg-gold/20 sm:grid-cols-2">
          {[
            "Digital nomads & remote workers",
            "Couples & young professionals",
            "Families with children",
            "Long-stay business travelers",
          ].map((item, i) => (
            <div key={i} className="bg-cream px-5 py-5">
              <span className="text-body text-ink-light">{item}</span>
            </div>
          ))}
        </div>

        <div className="soft-divider my-10" />

        <button onClick={() => setPage("contact")} className={BTN_SOLID}>
          Book Apartment
        </button>
      </FadeInView>
    </div>
  </section>
);
