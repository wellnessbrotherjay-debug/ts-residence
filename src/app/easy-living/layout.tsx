import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Easy Living",
  description:
    "Experience practical and premium monthly living at TS Residence with concierge support and prime Seminyak access.",
  alternates: { canonical: "/easy-living" },
};

export default function EasyLivingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
