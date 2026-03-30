import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apartments",
  description:
    "Explore SOLO, STUDIO, and SOHO apartment options for premium long-stay living in Seminyak.",
  alternates: {
    canonical: "/apartments",
  },
};

export default function ApartmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
