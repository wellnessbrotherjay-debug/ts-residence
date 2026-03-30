import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Find exclusive long-stay offers, monthly privileges, and flexible plans at TS Residence.",
  alternates: {
    canonical: "/offers",
  },
};

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
