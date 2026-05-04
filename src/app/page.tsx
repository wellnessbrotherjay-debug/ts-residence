import type { Metadata } from "next";
import HomeClient from "@/app/home-client";
import { DEFAULT_SEO, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Premium long-stay apartments in Seminyak with five-star living, wellness experiences, and easy monthly stay options.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TS Residence | Home",
    description:
      "Premium long-stay apartments in Seminyak with five-star living, wellness experiences, and easy monthly stay options.",
    url: SITE_URL,
    images: [
      {
        url: DEFAULT_SEO.ogImage,
        width: 1200,
        height: 630,
        alt: "TS Residence Seminyak",
      },
    ],
  },
};

export default function Page() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: DEFAULT_SEO.siteName,
    url: SITE_URL,
    image: DEFAULT_SEO.ogImage,
    telephone: "+62 811 1902 8111",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Nakula No.18, Legian, Seminyak",
      addressLocality: "Badung",
      addressRegion: "Bali",
      postalCode: "80361",
      addressCountry: "ID",
    },
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeClient />
    </>
  );
}
