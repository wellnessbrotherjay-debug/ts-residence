import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "View TS Residence gallery highlights across apartments, five-star facilities, and wellness lifestyle.",
  alternates: {
    canonical: "/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
