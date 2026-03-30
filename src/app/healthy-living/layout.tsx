import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthy Living",
  description:
    "Discover wellness-focused long-stay living at TS Residence with yoga, pilates, recovery, and community programs.",
  alternates: { canonical: "/healthy-living" },
};

export default function HealthyLivingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
