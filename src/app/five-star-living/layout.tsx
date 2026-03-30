import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Five-Star Living",
  description:
    "Discover integrated five-star facilities and service-led lifestyle at TS Residence Seminyak.",
  alternates: {
    canonical: "/five-star-living",
  },
};

export default function FiveStarLivingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
