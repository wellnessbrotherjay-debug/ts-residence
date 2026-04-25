import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | TS Residence",
  description: "Answers to common questions about TS Residence long-stay apartments in Seminyak, Bali.",
  alternates: { canonical: "/faq" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you offer monthly rentals in Seminyak?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. TS Residence offers fully furnished monthly rental apartments in Seminyak, Bali, designed for long-stay guests, digital nomads, professionals, and residents who want a flexible stay."
      }
    },
    {
      "@type": "Question",
      name: "What apartment types are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TS Residence offers SOLO, STUDIO, and SOHO apartments. SOLO is ideal for one person, STUDIO offers more space for longer stays, and SOHO is designed for guests who need more room or a work-living setup."
      }
    },
    {
      "@type": "Question",
      name: "Are the apartments fully furnished?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The apartments are fully furnished and ready to live in, including essential room features, air conditioning, WiFi, kitchen facilities, and access to TS Suites facilities depending on the stay package."
      }
    },
    {
      "@type": "Question",
      name: "Is TS Residence suitable for digital nomads?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. TS Residence is suitable for digital nomads, remote workers, and long-stay professionals who want a central Seminyak location, flexible living, and access to lifestyle facilities."
      }
    },
    {
      "@type": "Question",
      name: "Where is TS Residence located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TS Residence is located in Seminyak, Bali, close to restaurants, shopping, wellness facilities, nightlife, and key lifestyle destinations."
      }
    },
    {
      "@type": "Question",
      name: "How do I book an apartment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can book or inquire through the Book Apartment button, WhatsApp, email, or the contact form on the website."
      }
    },
    {
      "@type": "Question",
      name: "Do you offer flexible payment options?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. TS Residence offers flexible long-stay options, including Easy Pay and selected promotional offers depending on availability and current campaigns."
      }
    },
    {
      "@type": "Question",
      name: "Are there wellness or lifestyle benefits included?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. TS Residence guests may access selected TS Suites and No.1 Wellness Club benefits depending on the package, including lifestyle, wellness, and dining-related offers."
      }
    },
    {
      "@type": "Question",
      name: "Is TS Residence a hotel or apartment residence?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TS Residence is a long-stay apartment residence connected to the TS Suites lifestyle ecosystem. It is designed for monthly living rather than short hotel stays."
      }
    },
    {
      "@type": "Question",
      name: "Why choose TS Residence over a normal villa or apartment in Bali?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TS Residence combines the convenience of a serviced residence, a central Seminyak location, furnished apartments, flexible stay options, and access to lifestyle facilities in one integrated living experience."
      }
    }
  ]
};

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-gold-dark mb-10 text-center tracking-tight">
        Frequently Asked Questions
      </h1>
      <dl className="space-y-8">
        <div>
          <dt className="font-sans text-lg font-semibold text-ink mb-1">Do you offer monthly rentals in Seminyak?</dt>
          <dd className="text-base text-neutral-700">Yes. TS Residence offers fully furnished monthly rental apartments in Seminyak, Bali, designed for long-stay guests, digital nomads, professionals, and residents who want a flexible stay.</dd>
        </div>
        <div>
          <dt className="font-sans text-lg font-semibold text-ink mb-1">What apartment types are available?</dt>
          <dd className="text-base text-neutral-700">TS Residence offers <Link href="/apartments" className="text-gold underline hover:text-gold-dark">SOLO, STUDIO, and SOHO apartments</Link>. SOLO is ideal for one person, STUDIO offers more space for longer stays, and SOHO is designed for guests who need more room or a work-living setup.</dd>
        </div>
        <div>
          <dt className="font-sans text-lg font-semibold text-ink mb-1">Are the apartments fully furnished?</dt>
          <dd className="text-base text-neutral-700">Yes. The apartments are fully furnished and ready to live in, including essential room features, air conditioning, WiFi, kitchen facilities, and access to TS Suites facilities depending on the stay package.</dd>
        </div>
        <div>
          <dt className="font-sans text-lg font-semibold text-ink mb-1">Is TS Residence suitable for digital nomads?</dt>
          <dd className="text-base text-neutral-700">Yes. TS Residence is suitable for digital nomads, remote workers, and long-stay professionals who want a central Seminyak location, flexible living, and access to lifestyle facilities.</dd>
        </div>
        <div>
          <dt className="font-sans text-lg font-semibold text-ink mb-1">Where is TS Residence located?</dt>
          <dd className="text-base text-neutral-700">TS Residence is located in Seminyak, Bali, close to restaurants, shopping, wellness facilities, nightlife, and key lifestyle destinations.</dd>
        </div>
        <div>
          <dt className="font-sans text-lg font-semibold text-ink mb-1">How do I book an apartment?</dt>
          <dd className="text-base text-neutral-700">You can book or inquire through the Book Apartment button, WhatsApp, email, or the <Link href="/contact" className="text-gold underline hover:text-gold-dark">contact form</Link> on the website.</dd>
        </div>
        <div>
          <dt className="font-sans text-lg font-semibold text-ink mb-1">Do you offer flexible payment options?</dt>
          <dd className="text-base text-neutral-700">Yes. TS Residence offers flexible long-stay options, including Easy Pay and selected <Link href="/offers" className="text-gold underline hover:text-gold-dark">promotional offers</Link> depending on availability and current campaigns.</dd>
        </div>
        <div>
          <dt className="font-sans text-lg font-semibold text-ink mb-1">Are there wellness or lifestyle benefits included?</dt>
          <dd className="text-base text-neutral-700">Yes. TS Residence guests may access selected TS Suites and No.1 Wellness Club benefits depending on the package, including lifestyle, wellness, and dining-related offers.</dd>
        </div>
        <div>
          <dt className="font-sans text-lg font-semibold text-ink mb-1">Is TS Residence a hotel or apartment residence?</dt>
          <dd className="text-base text-neutral-700">TS Residence is a long-stay apartment residence connected to the TS Suites lifestyle ecosystem. It is designed for monthly living rather than short hotel stays.</dd>
        </div>
        <div>
          <dt className="font-sans text-lg font-semibold text-ink mb-1">Why choose TS Residence over a normal villa or apartment in Bali?</dt>
          <dd className="text-base text-neutral-700">TS Residence combines the convenience of a serviced residence, a central Seminyak location, furnished apartments, flexible stay options, and access to lifestyle facilities in one integrated living experience.</dd>
        </div>
      </dl>
    </main>
  );
}
