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
    short: "Compact & Efficient — Perfect for solo professionals or digital nomads.",
    description:
      "Live with intention in our 36 sqm private apartment, crafted for individuals who prioritize focus, independence, and flexibility. With a smart layout, natural light, and curated essentials, SOLO offers a quiet space to work, recharge, and thrive in Seminyak's vibrant energy.",
    hero: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/52b605cf-2c98-48f3-cce2-b317f0dbd800/public",
    gallery: [
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/52b605cf-2c98-48f3-cce2-b317f0dbd800/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/869ee230-3adf-427e-815b-588c107be500/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/883a2574-8b5a-4e37-d19b-7efb68dd8300/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/cabd75d6-fa73-43dc-4d28-1bb3e9dbbb00/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/14881fa7-a810-47a2-6f18-476fff260500/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/1ca02538-53de-4a57-bd02-5a2d46c1ba00/public",
    ],
    features: [
      "Fully furnished & ready to live in",
      "Pantry",
      "Cutlery",
      "Refrigerator",
      "Microwave oven",
      "50 inches tv",
      "Free WIFI",
      "Black out curtain",
      "King size bed",
      "Bed and linen",
      "Premium mattress",
      "Air conditioning",
      "Walk-in closet & storage",
      "2 Fixtures bathroom",
      "Long-term stay exclusive benefits!",
      "Easy payment terms if you stay longer than 3 months",
      "Full access to TS Suites facilities & amenities",
      "Fully furnished room",
      "Wellness programs",
      "Community experiences",
      "Free use of sauna, cold, and hot bath at N° 1 Wellness Club",
    ],
    audience: "Perfect for solo professionals or digital nomads",
  },
  studio: {
    name: "STUDIO",
    sqm: "48 sqm",
    bed: "1 Bedroom",
    short: "Spacious Comfort — Perfect for couples, creatives, and wellness seekers.",
    description:
      "Blending style and function, the STUDIO offers 48 sqm of open-plan living ideal for two. Whether you're creating, relaxing, or reconnecting, this thoughtfully designed residence gives you the space to stretch out — with seamless access to wellness programs and lifestyle perks.",
    hero: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/f5609092-040f-47f7-b9f7-d3fd8c13be00/public",
    gallery: [
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/f5609092-040f-47f7-b9f7-d3fd8c13be00/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/f0441a5d-92cc-4486-9afd-1072adcdb300/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/68c43de2-cb23-4b09-d793-a37dc3af6400/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/ee2c30aa-8e7b-4bf8-12bd-e182730b2500/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/5223b281-d02e-4e41-f5f8-cdce2eb96d00/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/55c2e7a0-e99e-458a-11ec-8d95033c8600/public",
    ],
    features: [
      "Fully furnished & ready to live in",
      "Pantry",
      "Cutlery",
      "Refrigerator",
      "Microwave oven",
      "50 inches tv",
      "Free WIFI",
      "Black out curtain",
      "King size bed",
      "Bed and linen",
      "Premium mattress",
      "Air conditioning",
      "Walk-in closet & storage",
      "2 Fixtures bathroom",
      "Long-term stay exclusive benefits!",
      "Easy payment terms if you stay longer than 3 months",
      "Full access to TS Suites facilities & amenities",
      "Fully furnished room",
      "Wellness programs",
      "Community experiences",
      "Free use of sauna, cold, and hot bath at N° 1 Wellness Club",
    ],
    audience: "Perfect for couples, creatives, and wellness seekers",
  },
  soho: {
    name: "SOHO",
    sqm: "80 sqm",
    bed: "2 Bedrooms",
    short: "Spacious Two-Bedroom Living — Perfect for small families or digital entrepreneurs.",
    description:
      "With 80 sqm of thoughtfully designed space, SOHO redefines long-term apartment living for those who value comfort and functionality. A dedicated living area, private sleeping spaces, and a full kitchen make this the perfect sanctuary for families or remote professionals building a life in Bali.",
    hero: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/2fef14ff-25f6-41d7-e15e-b19d9b793100/public",
    gallery: [
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/2fef14ff-25f6-41d7-e15e-b19d9b793100/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/f5605e7d-4781-4bc9-3fbc-e8b3ab8d0d00/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/577f5a79-0e8f-45c5-0c69-f679c2c1b500/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/653c6727-cb20-4b13-1b43-a09c1f3fb700/public",
      "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/aa2b7f20-35db-43ed-9ee3-37e46fe3dd00/public",
    ],
    features: [
      "Fully furnished & ready to live in",
      "Pantry",
      "Cutlery",
      "Refrigerator",
      "Microwave oven",
      "50 inches tv",
      "Free WIFI",
      "Black out curtain",
      "King size bed",
      "Bed and linen",
      "Premium mattress",
      "Air conditioning",
      "Walk-in closet & storage",
      "2 Fixtures bathroom",
      "Long-term stay exclusive benefits!",
      "Easy payment terms if you stay longer than 3 months",
      "Full access to TS Suites facilities & amenities",
      "Fully furnished room",
      "Wellness programs",
      "Community experiences",
      "Free use of sauna, cold, and hot bath at N° 1 Wellness Club",
    ],
    audience: "Perfect for small families or digital entrepreneurs",
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
