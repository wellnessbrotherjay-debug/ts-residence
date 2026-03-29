import { AppShell } from "@/components/site/app-shell";
import { ApartmentDetailPage } from "@/components/site/page-sections";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <AppShell>
      <ApartmentDetailPage slug={slug} />
    </AppShell>
  );
}
