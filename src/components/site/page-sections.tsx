import Link from "next/link";
import { notFound } from "next/navigation";
import {
  apartments,
  fiveStarFacilities,
  galleryCategories,
  offers,
} from "@/lib/site-data";
import { BTN_SOLID } from "./buttons";
import { FadeInView, StaggerContainer, StaggerItem } from "./animations";

export function ApartmentsIndexPage() {
  return (
    <div className="section-shell py-12 pb-24 lg:py-16 lg:pb-32">
      <FadeInView className="mb-16 max-w-3xl">
        <span className="label-caps text-gold">Suites &amp; Apartments</span>
        <h1 className="heading-display mt-5 text-5xl md:text-6xl lg:text-7xl">
          Find the apartment that fits your rhythm
        </h1>
        <p className="text-body mt-6 max-w-2xl">
          From compact solo living to generous family-sized layouts, each
          residence is fully furnished and supported by the services of TS
          Suites.
        </p>
      </FadeInView>

      <StaggerContainer
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        staggerDelay={0.15}
      >
        {apartments.map((apartment) => (
          <StaggerItem key={apartment.slug}>
            <Link
              href={`/apartments/${apartment.slug}`}
              className="group block"
            >
              <div className="relative aspect-4/5 overflow-hidden">
                <img
                  src={apartment.image}
                  alt={apartment.name}
                  className="h-full w-full object-cover transition-transform duration-1400 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <span className="label-caps text-white/70">
                    {apartment.sqm} · {apartment.bed}
                  </span>
                  <h2 className="mt-4 text-4xl">{apartment.name}</h2>
                </div>
              </div>
              <div className="card-surface border-t-0 p-8">
                <p className="text-body">{apartment.short}</p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}

export function ApartmentDetailPage({ slug }: { slug: string }) {
  const apartment = apartments.find((item) => item.slug === slug);
  if (!apartment) notFound();

  return (
    <div className="w-full">
      <section className="relative flex min-h-[80vh] items-center justify-center">
        <img
          src={apartment.image}
          alt={apartment.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-black/50" />
        <div className="relative z-10 px-6 text-center text-white">
          <FadeInView>
            <span className="label-caps text-white/70">
              {apartment.sqm} · {apartment.bed} · Fully Furnished
            </span>
            <h1 className="heading-display mt-4 text-6xl md:text-8xl lg:text-9xl">
              {apartment.name}
            </h1>
          </FadeInView>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="section-shell grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-20">
          <FadeInView direction="left">
            <h2 className="heading-section">Exceptional Living Space</h2>
            <p className="text-body mt-8 max-w-lg">{apartment.description}</p>
            <div className="mt-10 grid grid-cols-2 gap-6">
              {apartment.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="bg-gold h-1.5 w-1.5 rounded-full" />
                  <span className="text-ink text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <Link href="/contact" className={`${BTN_SOLID} mt-10`}>
              Book This Apartment
            </Link>
          </FadeInView>

          <FadeInView direction="right">
            <div className="grid gap-6">
              {apartment.gallery.map((image) => (
                <div key={image} className="overflow-hidden">
                  <img
                    src={image}
                    alt={apartment.name}
                    className="aspect-4/3 h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}

export function OffersPageContent() {
  return (
    <div className="section-shell py-12 pb-24 lg:py-16">
      <FadeInView className="mb-20">
        <span className="label-caps text-gold">Exclusive Deals</span>
        <h1 className="heading-display mt-4 text-5xl md:text-6xl lg:text-7xl">
          Special Offers
        </h1>
      </FadeInView>

      <StaggerContainer
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
        staggerDelay={0.15}
      >
        {offers.map((offer) => (
          <StaggerItem key={offer.title}>
            <div className="group">
              <div className="relative mb-6 aspect-16/10 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-full w-full object-cover transition-transform duration-1200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute right-6 bottom-6 left-6">
                  <span className="label-caps text-white/80">
                    Special Offer
                  </span>
                </div>
              </div>
              <h2 className="group-hover:text-gold text-2xl transition-colors">
                {offer.title}
              </h2>
              <p className="text-body mt-2">{offer.description}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}

export function GalleryPageContent() {
  return (
    <div className="section-shell py-12 pb-32 lg:py-16 lg:pb-40">
      <FadeInView className="mb-20">
        <span className="label-caps text-gold">Visual Journey</span>
        <h1 className="heading-display mt-4 text-5xl md:text-6xl lg:text-7xl">
          Gallery
        </h1>
      </FadeInView>

      <StaggerContainer
        className="grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2"
        staggerDelay={0.15}
      >
        {galleryCategories.map((cat) => (
          <StaggerItem key={cat.name}>
            <div className="mb-6">
              <h2 className="text-ink text-sm font-semibold">{cat.name}</h2>
              <p className="text-muted text-xs">{cat.handle}</p>
            </div>
            <div className="overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="aspect-16/10 h-full w-full object-cover transition-transform duration-1200 hover:scale-105"
              />
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}

export function FiveStarPageContent() {
  return (
    <div className="w-full">
      <section className="relative flex min-h-[85vh] items-center justify-center">
        <img
          src="https://tsresidence.id/wp-content/uploads/2025/10/ts-suites-coworking-space-red-dress-woman-scaled.webp"
          alt="Five Star Living"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-black/50" />
        <div className="relative z-10 px-6 text-center text-white">
          <FadeInView>
            <span className="label-caps text-white/70">Luxury Redefined</span>
            <h1 className="heading-display mt-6 max-w-4xl text-5xl md:text-7xl lg:text-8xl">
              Five-Star Living, Every Day
            </h1>
          </FadeInView>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="section-shell max-w-3xl text-center">
          <FadeInView>
            <div className="bg-gold/30 mx-auto mb-10 h-20 w-px" />
            <h2 className="text-ink text-2xl leading-relaxed md:text-3xl">
              At TS Residence, you don&apos;t just live. You live with the full
              privileges of a five-star hotel, from coworking and dining to
              salon and lifestyle services.
            </h2>
          </FadeInView>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="section-shell">
          <StaggerContainer
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
            staggerDelay={0.1}
          >
            {fiveStarFacilities.map((facility) => (
              <StaggerItem key={facility.title}>
                <div className="mb-4 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="aspect-4/3 h-full w-full object-cover transition-transform duration-1200 hover:scale-105"
                  />
                </div>
                <h3 className="label-caps text-ink">{facility.title}</h3>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}

export function HealthyLivingPageContent() {
  return (
    <div className="section-shell py-12 pb-24 lg:py-16">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <FadeInView direction="left">
          <div className="space-y-10">
            <div>
              <span className="label-caps text-gold">
                Wellness &amp; Recovery
              </span>
              <h1 className="heading-display mt-4 text-5xl md:text-6xl lg:text-7xl">
                Healthy Living
              </h1>
            </div>
            <p className="text-body max-w-lg">
              TS Residence combines five-star luxury with holistic wellness,
              giving residents daily access to restorative spaces and a calmer
              long-stay rhythm in Seminyak.
            </p>
            <div>
              <a href="https://www.no1wellness.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <h2 className="text-ink text-2xl md:text-3xl">
                  No.1 Wellness Club
                </h2>
              </a>
              <p className="text-gold mt-3 text-sm italic">
                You are our number one. Your well-being is our number one.
              </p>
              <p className="text-body mt-4 max-w-lg">
                A space for rejuvenation, recovery, and mindful activity. Where
                the body regains strength, the mind finds calm, and your energy
                returns to its natural state.
              </p>
            </div>
          </div>
        </FadeInView>
        <FadeInView direction="right">
          <img
            src="https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/d3acb1e6-97d9-49f0-da61-b4ad90f74300/public"
            alt="No.1 Wellness Club"
            className="aspect-4/5 h-full w-full object-cover"
          />
        </FadeInView>
      </div>
    </div>
  );
}

export function EasyLivingPageContent() {
  return (
    <div className="section-shell py-12 pb-24 lg:py-16">
      <section className="mx-auto max-w-350 text-center">
        <FadeInView>
          <span className="label-caps text-gold">
            Convenience &amp; Freedom
          </span>
          <h1 className="heading-display mt-4 text-5xl md:text-6xl lg:text-7xl">
            Easy Living
          </h1>
          <p className="text-body mx-auto mt-6 max-w-2xl">
            Apartments designed for monthly rentals, giving you a polished and
            hassle-free long-stay base in Bali.
          </p>
        </FadeInView>

        <StaggerContainer
          className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3 lg:gap-16"
          staggerDelay={0.15}
        >
          {[
            {
              title: "Location",
              description:
                "Walking distance to Seminyak Beach and Sunset Road. The best of Bali at your doorstep.",
            },
            {
              title: "Convenience",
              description:
                "Flexible monthly leases and concierge support to handle your daily needs without friction.",
            },
            {
              title: "Security",
              description:
                "24/7 professional security and secure residential access for complete peace of mind.",
            },
          ].map((item, index) => (
            <StaggerItem key={item.title}>
              <div className="space-y-4 text-center">
                <span className="text-gold text-4xl">0{index + 1}</span>
                <h2 className="text-ink text-xl">{item.title}</h2>
                <p className="text-body">{item.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInView className="mt-24">
          <img
            src="https://tsresidence.id/wp-content/uploads/2025/10/couple-walking-around-seminyak-e1761017959269.webp"
            alt="Seminyak Location"
            className="aspect-21/9 h-full w-full object-cover"
          />
        </FadeInView>
      </section>
    </div>
  );
}

export function ContactPageContent() {
  return (
    <div className="section-shell py-12 pb-20 lg:py-16">
      <FadeInView className="mb-12 md:mb-16 lg:mb-20">
        <span className="label-caps text-gold">Get in Touch</span>
        <h1 className="heading-display text-ink mt-4 mb-10 text-5xl md:mb-14 md:text-6xl lg:mb-16 lg:text-7xl">
          Let&apos;s talk about your long-stay
        </h1>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <p className="label-caps">Phone / WhatsApp</p>
            <p className="text-ink text-xl md:text-2xl">+62 811 1902 8111</p>
            <p className="label-caps pt-4">Telegram</p>
            <p className="text-ink text-xl md:text-2xl">+62 811 1902 8111</p>
          </div>
          <div className="space-y-3">
            <p className="label-caps">Email</p>
            <p className="text-ink text-xl md:text-2xl">
              tsresidence@townsquare.co.id
            </p>
          </div>
          <div className="space-y-3">
            <p className="label-caps">Address</p>
            <p className="text-ink text-xl leading-relaxed md:text-2xl">
              Jl. Nakula No.18, Legian, Seminyak, Bali
            </p>
          </div>
        </div>
      </FadeInView>

      <FadeInView className="mb-14 grid grid-cols-1 items-start gap-12 bg-white p-8 md:mb-20 md:p-14 lg:mb-24 lg:grid-cols-12 lg:gap-20 lg:p-20">
        <div className="lg:col-span-5">
          <img
            src="https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/306e3181-83b1-4aaa-05c4-2df1bf374200/public"
            alt="TS Residence"
            className="aspect-4/5 h-full min-h-64 w-full object-cover md:min-h-80 lg:min-h-100"
          />
        </div>

        <div className="space-y-10 lg:col-span-7">
          <div>
            <h2 className="text-ink text-3xl md:text-4xl">
              Looking for a long-term stay?
            </h2>
            <p className="text-body mt-3">
              Tell us what you&apos;re looking for and our team will get back to
              you with personalized recommendations.
            </p>
          </div>

          <form className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
            {[
              { label: "First Name", type: "text", placeholder: "First Name" },
              { label: "Last Name", type: "text", placeholder: "Last Name" },
              { label: "Email", type: "email", placeholder: "Email address" },
              {
                label: "Phone (optional)",
                type: "text",
                placeholder: "Phone number",
              },
            ].map((field) => (
              <div key={field.label} className="space-y-2">
                <label className="label-caps text-ink">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="border-gold/20 placeholder:text-muted/40 focus:border-gold w-full border-b bg-transparent py-3 text-sm transition-colors outline-none"
                />
              </div>
            ))}
            <div className="space-y-2 md:col-span-2">
              <label className="label-caps text-ink">Stay Duration</label>
              <select className="border-gold/20 focus:border-gold w-full appearance-none border-b bg-transparent py-3 text-sm transition-colors outline-none">
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="label-caps text-ink">Message (optional)</label>
              <textarea
                rows={4}
                placeholder="Type your message here..."
                className="border-gold/20 placeholder:text-muted/40 focus:border-gold w-full resize-none border-b bg-transparent py-3 text-sm transition-colors outline-none"
              />
            </div>
            <div className="pt-4 md:col-span-2">
              <button type="button" className={BTN_SOLID}>
                Send Inquiry
              </button>
            </div>
          </form>
        </div>
      </FadeInView>

      <div className="border-gold/35 border-t pt-12 md:pt-16 lg:pt-20">
        <h2 className="text-ink mb-8 text-2xl md:mb-12 md:text-3xl lg:mb-14">
          Terms &amp; Conditions
        </h2>
        <div className="text-muted grid grid-cols-1 gap-10 text-[12px] leading-relaxed md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          <div className="space-y-10 lg:col-span-2">
            <div>
              <h3 className="label-caps text-ink mb-4">Terms of Payment</h3>
              <ol className="list-decimal space-y-3 pl-4">
                <li>
                  Rental cost paid monthly in advance by the 25th day of the
                  current month.
                </li>
                <li>
                  Refundable security deposit of one month rental cost before
                  lease commencement.
                </li>
                <li>All costs are applicable to tax and service charge.</li>
              </ol>
            </div>
            <div>
              <h3 className="label-caps text-ink mb-4">Additional Cost</h3>
              <ol className="list-decimal space-y-2 pl-4">
                <li>Electricity</li>
              </ol>
            </div>
          </div>
          <div>
            <h3 className="label-caps text-ink mb-4">Included in Rental</h3>
            <ol className="list-decimal space-y-3 pl-4">
              <li>All units fully furnished</li>
              <li>
                Access to pool, gym, restaurant, and business center at TS
                Suites
              </li>
              <li>Parking spot for one vehicle</li>
              <li>Periodic maintenance</li>
              <li>Internet, TV, water, and concierge</li>
            </ol>
          </div>
          <div>
            <h3 className="label-caps text-ink mb-4">Optional Services</h3>
            <ol className="list-decimal space-y-3 pl-4">
              <li>Laundry</li>
              <li>Housekeeping</li>
              <li>Breakfast</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
