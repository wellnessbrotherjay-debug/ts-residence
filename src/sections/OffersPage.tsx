import { useState, useEffect } from "react";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "../components/animations";
import { EditableImage } from "../components/EditableImage";
import type { DBImage } from "../types";
import { listImages } from "@/lib/images-client";

export const OffersPage = () => {
  const [images, setImages] = useState<DBImage[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      setImages(await listImages("offers"));
    };

    loadImages();
  }, []);

  const defaultOffers = [
    {
      title: "Opening Celebration",
      desc: "Stay 3 months, pay 2 months on all apartment categories.",
      img: "https://picsum.photos/seed/offer1-ts/1920/800",
    },
    {
      title: "Easy Pay",
      desc: "Stay more than 3 months — 20% upfront, rest paid monthly to keep your cash flow.",
      img: "https://picsum.photos/seed/offer2-ts/1920/800",
    },
    {
      title: "Resident Dining",
      desc: "15% discount at TS Suites for all F&B and retail services.",
      img: "https://picsum.photos/seed/offer3-ts/1920/800",
    },
    {
      title: "Wellness Discount",
      desc: "15% discount at No.1 Wellness Club on massage, wellness, and F&B.",
      img: "https://picsum.photos/seed/offer4-ts/1920/800",
    },
  ];

  const displayOffers =
    images.length > 0
      ? images.map((img, i) => ({
          title: img.alt || defaultOffers[i]?.title || `Offer ${i + 1}`,
          desc: defaultOffers[i]?.desc || "",
          img: img.url,
        }))
      : defaultOffers;

  return (
    <div className="pt-32 pb-0">
      <div className="mx-auto mb-20 max-w-[1400px] px-6 md:px-10">
        <FadeInView>
          <span className="label-caps text-gold">Exclusive Deals</span>
          <h1 className="heading-display text-ink mt-4 text-5xl md:text-6xl lg:text-7xl">
            Special Offers
          </h1>
        </FadeInView>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pb-20 md:px-10">
        <StaggerContainer
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
          staggerDelay={0.15}
        >
          {displayOffers.map((offer, i) => (
            <StaggerItem key={i}>
              <div className="group cursor-pointer">
                <div className="relative mb-6 aspect-[16/10] overflow-hidden">
                  <EditableImage
                    src={offer.img}
                    alt={offer.title}
                    category="offers"
                    className="h-full w-full"
                    onImageChange={() => {
                      listImages("offers").then((d) => setImages(d));
                    }}
                  >
                    {(src: string) => (
                      <img
                        src={src}
                        alt={offer.title}
                        className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </EditableImage>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute right-6 bottom-6 left-6">
                    <span className="label-caps text-gold-light">
                      Special Offer
                    </span>
                  </div>
                </div>
                <h3 className="text-ink group-hover:text-gold mb-2 font-serif text-2xl transition-colors">
                  {offer.title}
                </h3>
                <p className="text-body">{offer.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
};
