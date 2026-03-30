import { useEffect, useState } from "react";
import type { DBImage, Page } from "../types";
import { HeroSection } from "../components/HeroSection";
import { HomeHeadline } from "../components/home/HomeHeadline";
import { HomePillars } from "../components/home/HomePillars";
import { HomeWhySeminyak } from "../components/home/HomeWhySeminyak";
import { HomeApartments } from "../components/home/HomeApartments";
import { HomeOffers } from "../components/home/HomeOffers";
import { HomeYourHome } from "../components/home/HomeYourHome";
import { listImages } from "@/lib/images-client";

export const HomePage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [heroImage, setHeroImage] = useState<string>(
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=70",
  );
  const [apartmentImages, setApartmentImages] = useState<DBImage[]>([]);
  const [generalImages, setGeneralImages] = useState<DBImage[]>([]);

  const getAptImg = (index: number, fallback: string) =>
    apartmentImages[index]?.url || fallback;
  const getGenImg = (index: number, fallback: string) =>
    generalImages[index]?.url || fallback;

  const apartments = [
    {
      name: "SOLO",
      sqm: "36",
      bed: "1 Bedroom",
      desc: "Compact luxury for solo explorers",
      img: getAptImg(0, "https://picsum.photos/seed/solo-apt/1920/1080"),
      page: "solo" as Page,
    },
    {
      name: "STUDIO",
      sqm: "48",
      bed: "1 Bedroom",
      desc: "Spacious elegance for couples",
      img: getAptImg(1, "https://picsum.photos/seed/studio-apt/1920/1080"),
      page: "studio" as Page,
    },
    {
      name: "SOHO",
      sqm: "80",
      bed: "2 Bedrooms",
      desc: "Ultimate space for families",
      img: getAptImg(2, "https://picsum.photos/seed/soho-apt/1920/1080"),
      page: "soho" as Page,
    },
  ];

  const updateApartmentImage = (index: number, url: string) => {
    setApartmentImages((prev) => {
      const next = [...prev];
      next[index] = {
        id: next[index]?.id ?? Date.now() + index,
        url,
        category: apartments[index].page,
        alt: `${apartments[index].name} Apartment`,
        created_at: next[index]?.created_at || new Date().toISOString(),
      };
      return next;
    });
  };

  useEffect(() => {
    const loadImages = async () => {
      const heroImages = await listImages("hero");
      if (heroImages[0]) setHeroImage(heroImages[0].url);

      const types = ["solo", "studio", "soho"];
      const results = await Promise.all(types.map((t) => listImages(t)));
      setApartmentImages(
        results.map(
          (d, i) =>
            d[0] || {
              id: -1,
              url: `https://picsum.photos/seed/${types[i]}-apt/1920/1080`,
              category: types[i],
              alt: `${types[i].toUpperCase()} Apartment`,
              created_at: new Date().toISOString(),
            },
        ),
      );
      setGeneralImages(await listImages("general"));
    };

    loadImages();
  }, []);

  return (
    <div className="w-full">
      <HeroSection heroImage={heroImage} setHeroImage={setHeroImage} />
      <HomeHeadline setPage={setPage} />
      <HomePillars setPage={setPage} />
      <HomeWhySeminyak
        setPage={setPage}
        imgSrc={getGenImg(
          0,
          "https://picsum.photos/seed/seminyak-pool/1600/1800",
        )}
      />
      <HomeApartments
        setPage={setPage}
        apartments={apartments}
        onImageChange={updateApartmentImage}
      />
      <HomeOffers setPage={setPage} />
      <HomeYourHome
        setPage={setPage}
        imgSrc={getGenImg(
          1,
          "https://picsum.photos/seed/young-family/1200/1600",
        )}
      />
    </div>
  );
};
