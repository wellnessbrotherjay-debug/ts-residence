import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthy Living",
  description:
    "Experience wellness-focused long-stay living with No.1 Wellness Club programs and facilities at TS Residence.",
  alternates: {
    canonical: "/healthy-living",
  },
};

export default function HealthyLivingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
