export type ApartmentSlug = "solo" | "studio" | "soho";

export const navGroups = {
  left: [
    { label: "Apartments", href: "/apartments" },
    { label: "Offers", href: "/offers" },
    { label: "Gallery", href: "/gallery" },
  ],
  right: [
    { label: "Five-Star", href: "/five-star" },
    { label: "Wellness", href: "/healthy-living" },
    { label: "Contact", href: "/contact" },
  ],
};

export const apartments = [
  {
    slug: "solo" as ApartmentSlug,
    name: "SOLO",
    sqm: "36 sqm",
    bed: "1 Bedroom",
    short: "Compact luxury for solo explorers",
    description:
      "A compact yet premium living space designed for solo explorers or business travelers. Experience a refined balance of privacy, functionality, and service in the heart of Seminyak.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    ],
    features: [
      "Rain shower",
      "Smart TV",
      "Designer kitchen",
      "Private balcony",
      "High-speed Wi-Fi",
    ],
  },
  {
    slug: "studio" as ApartmentSlug,
    name: "STUDIO",
    sqm: "48 sqm",
    bed: "1 Bedroom",
    short: "Spacious elegance for couples",
    description:
      "Spacious and elegant, the Studio apartment is suited to couples or solo residents who want room to live, work, and unwind without losing the feeling of a serviced retreat.",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ],
    features: [
      "Spacious living area",
      "King size bed",
      "Full kitchen",
      "Large balcony",
      "Premium sound system",
    ],
  },
  {
    slug: "soho" as ApartmentSlug,
    name: "SOHO",
    sqm: "80 sqm",
    bed: "2 Bedrooms",
    short: "Ultimate space for families",
    description:
      "The SOHO apartment delivers the most expansive residential experience, combining privacy, comfort, and flexible living for families or longer stays in Bali.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&sat=-10",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&sat=-10",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&bri=-10",
    ],
    features: [
      "2 master bedrooms",
      "2 ensuite bathrooms",
      "Dining space",
      "Wrap-around balcony",
      "Washing machine",
    ],
  },
];

export const homePillars = [
  {
    title: "Five-Star Living",
    description:
      "Full privileges of a luxury hotel with coworking, dining, salon, and retail in one polished address.",
    href: "/five-star",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    stat: "Hotel-grade privileges",
  },
  {
    title: "Healthy Living",
    description:
      "Daily yoga, reformer Pilates, sauna, cold bath, and IV therapy curated for a restorative routine.",
    href: "/healthy-living",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    stat: "Daily wellness access",
  },
  {
    title: "Easy Living",
    description:
      "A seamless monthly stay near Seminyak Beach with concierge support and effortless day-to-day convenience.",
    href: "/easy-living",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    stat: "Flexible long-stay living",
  },
];

export const galleryCategories = [
  {
    name: "TS Residence",
    handle: "@tsresidences",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Apartments",
    handle: "@tsresidences",
    image:
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Facilities",
    handle: "@tssuitesseminyak",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "No.1 Wellness Club",
    handle: "@nolwellnessclub",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
  },
];

export const offers = [
  {
    title: "Opening Celebration",
    description: "Stay 3 months, pay 2 months on all apartment categories.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Easy Pay",
    description:
      "Stay more than 3 months with 20% upfront and the rest paid monthly.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Resident Dining",
    description:
      "15% discount at TS Suites for food, beverage, and selected retail services.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Wellness Discount",
    description:
      "15% discount at No.1 Wellness Club for massage, wellness, and F&B.",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1600&q=80",
  },
];

export const fiveStarFacilities = [
  {
    title: "TS Suites Coworking Space",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "TSTORE",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Christophe C Salon",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "TS Suites Bar",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80",
  },
];
