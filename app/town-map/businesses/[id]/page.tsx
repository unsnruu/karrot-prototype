import { notFound } from "next/navigation";
import { TownMapBusinessDetailScreen } from "@/features/town-map/screens/town-map-business-detail-screen";
import { getTownMapBusinessDetail } from "@/lib/town-map-business-data";
import { resolveTabHref } from "@/lib/tab-navigation";

export default async function TownMapBusinessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string | string[] }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const tab = Array.isArray(resolvedSearchParams.tab) ? resolvedSearchParams.tab[0] : resolvedSearchParams.tab;
  const detail = await getTownMapBusinessDetail(id);

  if (!detail) {
    notFound();
  }

  return <TownMapBusinessDetailScreen backHref={resolveTabHref(tab, "/town-map")} detail={detail} />;
}
