export type ApartmentKey = "solo" | "studio" | "soho";

export const apartmentDetailMap: Record<
  ApartmentKey,
  {
    name: string;
    sqm: string;
    bed: string;
    short: string;
    description: string;
    hero: string;
    gallery: string[];
    features: string[];
    audience: string;
  }
> = {
  solo: {
    name: "SOLO",
    sqm: "36 sqm",
    bed: "1 Bedroom",
    short: "Compact luxury for independent residents.",
    description:
      "SOLO is designed for residents who want a refined, efficient space with hotel-grade comfort and daily practicality for monthly living in Seminyak.",
    hero: "https://tsresidence.id/wp-content/uploads/2025/08/solo-main-image.webp",
    gallery: [
      "https://tsresidence.id/wp-content/uploads/2025/08/solo-main-image.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-full-building-from-front.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/leisure-cllub-co-working-space-scaled.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-suies-restaurant-seminyak-bali-scaled.webp",
    ],
    features: [
      "Fully furnished interior",
      "Private bedroom + living zone",
      "High-speed internet access",
      "Concierge and support services",
      "Access to integrated facilities",
    ],
    audience: "Ideal for digital nomads and business travelers",
  },
  studio: {
    name: "STUDIO",
    sqm: "48 sqm",
    bed: "1 Bedroom",
    short: "Spacious one-bedroom balance for couples.",
    description:
      "STUDIO offers a more spacious one-bedroom layout, ideal for residents who need comfort, flexibility, and a polished environment for both living and work.",
    hero: "https://tsresidence.id/wp-content/uploads/2025/08/studio-main-image.webp",
    gallery: [
      "https://tsresidence.id/wp-content/uploads/2025/08/studio-main-image.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-suites-courtyard-noon-scaled.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-suies-restaurant-seminyak-bali-scaled.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-near-by-seminyak-beach-e1759392750339.webp",
    ],
    features: [
      "Larger bedroom and living area",
      "Monthly-stay optimized layout",
      "Dedicated dining and work comfort",
      "Hotel-level operational support",
      "Prime Seminyak location",
    ],
    audience: "Best for couples or solo professionals needing more room",
  },
  soho: {
    name: "SOHO",
    sqm: "80 sqm",
    bed: "2 Bedrooms",
    short: "Expansive layout for family-style long stay.",
    description:
      "SOHO is the most generous apartment typology, built for families or residents requiring two bedrooms, additional flexibility, and premium long-stay comfort.",
    hero: "https://tsresidence.id/wp-content/uploads/2025/08/soho-main-image.webp",
    gallery: [
      "https://tsresidence.id/wp-content/uploads/2025/08/soho-main-image.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-building-front-left.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-suites-courtyard-noon-scaled.webp",
      "https://tsresidence.id/wp-content/uploads/2025/10/ts-residence-near-by-bali-toll.webp",
    ],
    features: [
      "Two-bedroom configuration",
      "Ideal for family long-stay",
      "Generous circulation and privacy",
      "Access to wellness and lifestyle facilities",
      "Concierge-led resident experience",
    ],
    audience: "Designed for families and residents needing maximum space",
  },
};

export const apartmentDisplayList = (
  Object.entries(apartmentDetailMap) as [
    ApartmentKey,
    (typeof apartmentDetailMap)[ApartmentKey],
  ][]
).map(([slug, value]) => ({
  slug,
  name: value.name,
  sqm: value.sqm,
  bed: value.bed,
  short: value.short,
  image: value.hero,
  audience: value.audience,
}));
