import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Easy Living",
  description:
    "Enjoy practical, flexible, and premium long-stay life in Seminyak with TS Residence Easy Living concept.",
  alternates: {
    canonical: "/easy-living",
  },
};

export default function EasyLivingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
