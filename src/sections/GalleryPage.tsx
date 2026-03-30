import { useState, useEffect } from "react";
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "../components/animations";
import { EditableImage } from "../components/EditableImage";
import type { DBImage } from "../types";
import { listImages } from "@/lib/images-client";

export const GalleryPage = () => {
  const [images, setImages] = useState<DBImage[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      setImages(await listImages());
    };

    loadImages();
  }, []);

  const categories = [
    {
      name: "TS Residence",
      handle: "@tsresidences",
      filter: "residence",
      avatar: "https://picsum.photos/seed/avatar1/100/100",
    },
    {
      name: "Apartments",
      handle: "@tsresidences",
      filter: "apartments",
      avatar: "https://picsum.photos/seed/avatar2/100/100",
    },
    {
      name: "Facilities",
      handle: "@tssuitesseminyak",
      filter: "five-star",
      avatar: "https://picsum.photos/seed/avatar3/100/100",
    },
    {
      name: "No.1 Wellness Club",
      handle: "@nolwellnessclub",
      filter: "healthy",
      avatar: "https://picsum.photos/seed/avatar4/100/100",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-6 pt-32 pb-40 md:px-10">
      <FadeInView className="mb-20">
        <span className="label-caps text-gold">Visual Journey</span>
        <h1 className="heading-display text-ink mt-4 text-5xl md:text-6xl lg:text-7xl">
          Gallery
        </h1>
      </FadeInView>

      <StaggerContainer
        className="grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2"
        staggerDelay={0.15}
      >
        {categories.map((cat) => {
          const catImages = images.filter((img) => img.category === cat.filter);
          const displayImg =
            catImages[0]?.url ||
            `https://picsum.photos/seed/${cat.filter}/1200/800`;

          return (
            <StaggerItem key={cat.name}>
              <div className="mb-6 flex items-center gap-4">
                <div className="border-gold/20 h-11 w-11 overflow-hidden rounded-full border">
                  <img
                    src={cat.avatar}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-ink font-sans text-sm font-semibold">
                    {cat.name}
                  </h4>
                  <p className="text-muted text-xs">{cat.handle}</p>
                </div>
              </div>
              <div className="img-zoom relative aspect-[16/10] cursor-pointer">
                <EditableImage
                  src={displayImg}
                  alt={cat.name}
                  category={cat.filter}
                  className="h-full w-full"
                  onImageChange={() => {
                    listImages().then((d) => setImages(d));
                  }}
                >
                  {(src: string) => (
                    <img
                      src={src}
                      alt={cat.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </EditableImage>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
};
